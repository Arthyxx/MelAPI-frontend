import type { AxiosError } from 'axios';

import type {
  ApiErrorResponse,
} from './pedido.types';

export function getErrorMessage(
  requestError:
    AxiosError<ApiErrorResponse>,
  fallbackMessage: string,
) {
  const apiMessage =
    requestError.response?.data
      ?.message;

  if (Array.isArray(apiMessage)) {
    return apiMessage.join(' ');
  }

  return (
    apiMessage ||
    requestError.response?.data
      ?.error ||
    fallbackMessage
  );
}