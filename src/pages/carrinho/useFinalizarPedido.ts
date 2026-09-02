import type {
  AxiosError,
} from 'axios';
import {
  useState,
} from 'react';
import {
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../../contexts/useAuth';
import {
  api,
} from '../../services/api';
import type {
  CartItem,
} from '../../utils/cart';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface PedidoCriadoResponse {
  id: number;
}

interface CheckoutResponse {
  pedidoId: number;
  preferenceId: string;
  checkoutUrl: string;
}

interface UseFinalizarPedidoOptions {
  items: CartItem[];

  shippingServiceId?:
    | string
    | null;

  onOrderCreated: () => void;
}

function getApiErrorMessage(
  error: AxiosError<ApiErrorResponse>,
  fallbackMessage: string,
) {
  const apiMessage =
    error.response?.data?.message;

  if (Array.isArray(apiMessage)) {
    return apiMessage.join(' ');
  }

  return (
    apiMessage ||
    error.response?.data?.error ||
    fallbackMessage
  );
}

export function useFinalizarPedido({
  items,
  shippingServiceId = null,
  onOrderCreated,
}: UseFinalizarPedidoOptions) {
  const navigate = useNavigate();

  const {
    isAuthenticated,
  } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const finalizarPedido =
    async () => {
      clearMessages();

      if (!isAuthenticated) {
        navigate('/login', {
          replace: true,
        });

        return;
      }

      if (items.length === 0) {
        setError(
          'O carrinho está vazio.',
        );

        return;
      }

      if (!shippingServiceId) {
        setError(
          'Calcule o frete e selecione uma opção de entrega antes de finalizar o pedido.',
        );

        return;
      }

      setLoading(true);

      let pedidoId: number | null =
        null;

      try {
        const pedidoResponse =
          await api.post<PedidoCriadoResponse>(
            '/pedidos',
            {
              items: items.map(
                (item) => ({
                  produtoId:
                    item.id,

                  quantity:
                    item.quantity,
                }),
              ),

              shippingServiceId,
            },
          );

        pedidoId =
          pedidoResponse.data.id;

        onOrderCreated();

        setSuccess(
          `Pedido #${pedidoId} criado. Abrindo pagamento...`,
        );

        const checkoutResponse =
          await api.post<CheckoutResponse>(
            `/pagamentos/pedidos/${pedidoId}/checkout`,
          );

        const checkoutUrl =
          checkoutResponse.data
            .checkoutUrl;

        if (!checkoutUrl) {
          throw new Error(
            'URL de pagamento não retornada.',
          );
        }

        window.location.assign(
          checkoutUrl,
        );
      } catch (requestError) {
        if (
          pedidoId !== null
        ) {
          console.error(
            'Pedido criado, mas não foi possível iniciar o pagamento:',
            requestError,
          );

          setError(
            `O pedido #${pedidoId} foi criado, mas não foi possível abrir o pagamento. Acesse “Meus pedidos” para tentar pagar novamente.`,
          );

          setSuccess('');

          window.setTimeout(() => {
            navigate(
              `/meus-pedidos/${pedidoId}`,
              {
                replace: true,
              },
            );
          }, 2500);

          return;
        }

        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao finalizar pedido:',
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
          getApiErrorMessage(
            axiosError,
            'Erro ao finalizar pedido. Verifique o estoque dos produtos e tente novamente.',
          ),
        );
      } finally {
        setLoading(false);
      }
    };

  const setSuccessMessage = (
    message: string,
  ) => {
    setError('');
    setSuccess(message);
  };

  return {
    loading,
    error,
    success,

    finalizarPedido,
    clearMessages,
    setSuccessMessage,
  };
}