import { isAxiosError } from 'axios';

import type {
  ApiErrorResponse,
  PerfilFormData,
} from './perfil.types';

export function getPerfilApiErrorMessage(
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

export function logPerfilApiError(
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

export function formatPerfilFieldValue(
  field: keyof PerfilFormData,
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

export function normalizePerfilData(
  data: PerfilFormData,
): PerfilFormData {
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    street: data.street || '',
    addressNumber:
      data.addressNumber || '',
    complement:
      data.complement || '',
    neighborhood:
      data.neighborhood || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    role: data.role,
  };
}