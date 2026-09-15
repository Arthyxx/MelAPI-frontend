import type { AxiosError } from 'axios';
import { useState } from 'react';

import {
  refundPedidoApi,
  updatePedidoStatusApi,
} from './pedido.api';

import type { ApiErrorResponse } from './pedido.types';
import { getErrorMessage } from './pedido.utils';

interface UsePedidoStatusOptions {
  onUpdated: () => Promise<void>;
}

export function usePedidoStatus({
  onUpdated,
}: UsePedidoStatusOptions) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [refundingId, setRefundingId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setUpdatingId(pedidoId);

      await updatePedidoStatusApi(pedidoId, status);

      setSuccess(
        `Status do pedido #${pedidoId} atualizado com sucesso.`,
      );

      await onUpdated();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error('Erro ao atualizar status:', {
        statusCode: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

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

  const refundPedido = async (pedidoId: number) => {
    clearMessages();
    setRefundingId(pedidoId);

    try {
      const result = await refundPedidoApi(pedidoId);

      if (result.refundAmount !== undefined) {
        setSuccess(
          `Pedido #${pedidoId} cancelado e reembolsado com sucesso. Valor reembolsado: R$ ${result.refundAmount.toFixed(
            2,
          )}.`,
        );
      } else {
        setSuccess(
          `Pedido #${pedidoId} cancelado e reembolsado com sucesso.`,
        );
      }
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error('Erro ao reembolsar pedido:', {
        statusCode: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      setError(
        getErrorMessage(
          axiosError,
          'Não foi possível confirmar o reembolso. Confira o status atualizado do pedido.',
        ),
      );
    } finally {
      // O backend pode ter alterado o status antes de retornar um erro.
      // Consultamos a lista novamente, sem repetir o reembolso.
      try {
        await onUpdated();
      } catch (refreshError) {
        const axiosError =
          refreshError as AxiosError<ApiErrorResponse>;

        console.error('Erro ao atualizar pedidos após reembolso:', {
          statusCode: axiosError.response?.status,
          message: axiosError.message,
        });

        // Proteção caso o callback passe a propagar erros.
        setError((currentError) =>
          [
            currentError,
            'Não foi possível atualizar os pedidos. Recarregue a página para conferir a situação atual.',
          ]
            .filter(Boolean)
            .join(' '),
        );
      } finally {
        setRefundingId(null);
      }
    }
  };

  return {
    updatingId,
    refundingId,
    error,
    success,
    updateStatus,
    refundPedido,
  };
}
