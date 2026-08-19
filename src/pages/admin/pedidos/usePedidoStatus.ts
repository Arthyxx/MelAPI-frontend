import type { AxiosError } from 'axios';
import { useState } from 'react';

import {
  updatePedidoStatusApi,
} from './pedido.api';

import type {
  ApiErrorResponse,
} from './pedido.types';

import {
  getErrorMessage,
} from './pedido.utils';

interface UsePedidoStatusOptions {
  onUpdated: () => Promise<void>;
}

export function usePedidoStatus({
  onUpdated,
}: UsePedidoStatusOptions) {
  const [
    updatingId,
    setUpdatingId,
  ] = useState<number | null>(null);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const updateStatus = async (
    pedidoId: number,
    status: string,
  ) => {
    try {
      clearMessages();

      setUpdatingId(
        pedidoId,
      );

      await updatePedidoStatusApi(
        pedidoId,
        status,
      );

      setSuccess(
        `Status do pedido #${pedidoId} atualizado com sucesso.`,
      );

      await onUpdated();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error(
        'Erro ao atualizar status:',
        {
          statusCode:
            axiosError.response
              ?.status,
          data:
            axiosError.response
              ?.data,
          message:
            axiosError.message,
        },
      );

      setError(
        getErrorMessage(
          axiosError,
          'Erro ao atualizar status.',
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    updatingId,
    error,
    success,
    updateStatus,
  };
}