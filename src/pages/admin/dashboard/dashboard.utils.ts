import type {
  AxiosError,
} from 'axios';

import type {
  ApiErrorResponse,
} from './dashboard.types';

export function getDashboardErrorMessage(
  requestError:
    AxiosError<ApiErrorResponse>,
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
    'Não foi possível carregar os dados da loja.'
  );
}