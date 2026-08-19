import { isAxiosError } from 'axios';

import type {
  ApiErrorResponse,
  CadastroFormData,
} from './cadastro.types';

export function getCadastroApiErrorMessage(
  error: unknown,
) {
  const fallback =
    'Erro ao realizar cadastro. Verifique os dados e tente novamente.';

  if (
    !isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return fallback;
  }

  const message =
    error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  if (typeof message === 'string') {
    return message;
  }

  const apiError =
    error.response?.data?.error;

  if (typeof apiError === 'string') {
    return apiError;
  }

  return fallback;
}

export function logCadastroApiError(
  error: unknown,
) {
  if (
    isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    console.error(
      'Erro ao realizar cadastro:',
      {
        statusCode:
          error.response?.status,
        data:
          error.response?.data,
        message: error.message,
      },
    );

    return;
  }

  console.error(
    'Erro ao realizar cadastro:',
    error,
  );
}

export function formatCadastroFieldValue(
  field: keyof CadastroFormData,
  value: string,
) {
  if (field === 'phone') {
    return value
      .replace(/\D/g, '')
      .slice(0, 11);
  }

  if (field === 'zipCode') {
    return value
      .replace(/\D/g, '')
      .slice(0, 8);
  }

  if (field === 'state') {
    return value
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 2);
  }

  return value;
}