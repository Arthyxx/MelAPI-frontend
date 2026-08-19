import { isAxiosError } from 'axios';

import type {
  AvaliacaoProduto,
} from '../../../types/avaliacaoProduto';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
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

export function logApiError(
  title: string,
  error: unknown,
) {
  if (
    isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    console.error(title, {
      statusCode:
        error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return;
  }

  console.error(title, {
    message:
      error instanceof Error
        ? error.message
        : 'Erro desconhecido.',
  });
}

export function calcularMediaAvaliacoes(
  avaliacoes: AvaliacaoProduto[],
) {
  if (avaliacoes.length === 0) {
    return 0;
  }

  const total = avaliacoes.reduce(
    (sum, avaliacao) =>
      sum + avaliacao.rating,
    0,
  );

  return total / avaliacoes.length;
}

export function filtrarOutrasAvaliacoes(
  avaliacoes: AvaliacaoProduto[],
  minhaAvaliacao?: AvaliacaoProduto | null,
) {
  if (!minhaAvaliacao) {
    return avaliacoes;
  }

  return avaliacoes.filter(
    (avaliacao) =>
      avaliacao.id !==
      minhaAvaliacao.id,
  );
}