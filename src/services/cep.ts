import axios from 'axios';

export interface CepAddress {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

type CepLookupErrorCode =
  | 'INVALID_FORMAT'
  | 'NOT_FOUND'
  | 'UNAVAILABLE';

export class CepLookupError extends Error {
  public readonly code: CepLookupErrorCode;

  constructor(message: string, code: CepLookupErrorCode) {
    super(message);
    this.name = 'CepLookupError';
    this.code = code;
  }
}

const cepClient = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 8000,
  withCredentials: false,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function lookupCep(
  value: string,
  signal?: AbortSignal,
): Promise<CepAddress> {
  const trimmedValue = value.trim();

  if (!/^\d{5}-?\d{3}$/.test(trimmedValue)) {
    throw new CepLookupError(
      'Informe um CEP válido com 8 números.',
      'INVALID_FORMAT',
    );
  }

  const zipCode = trimmedValue.replace('-', '');

  let data: unknown;

  try {
    const response = await cepClient.get<unknown>(
      `/${zipCode}/json/`,
      { signal },
    );

    data = response.data;
  } catch (error: unknown) {
    if (axios.isCancel(error)) {
      throw error;
    }

    throw new CepLookupError(
      'Não foi possível consultar o CEP agora. Tente novamente.',
      'UNAVAILABLE',
    );
  }

  if (!isRecord(data)) {
    throw new CepLookupError(
      'O serviço de CEP retornou uma resposta inválida. Tente novamente.',
      'UNAVAILABLE',
    );
  }

  if (data.erro === true || data.erro === 'true') {
    throw new CepLookupError(
      'CEP não encontrado. Confira os números informados.',
      'NOT_FOUND',
    );
  }

  if (
    typeof data.cep !== 'string' ||
    data.cep.replace(/\D/g, '') !== zipCode ||
    typeof data.localidade !== 'string' ||
    !data.localidade.trim() ||
    typeof data.uf !== 'string' ||
    !/^[A-Z]{2}$/.test(data.uf)
  ) {
    throw new CepLookupError(
      'O serviço de CEP retornou dados incompletos. Tente novamente.',
      'UNAVAILABLE',
    );
  }

  return {
    zipCode,
    street:
      typeof data.logradouro === 'string'
        ? data.logradouro.trim()
        : '',
    neighborhood:
      typeof data.bairro === 'string'
        ? data.bairro.trim()
        : '',
    city: data.localidade.trim(),
    state: data.uf,
  };
}
