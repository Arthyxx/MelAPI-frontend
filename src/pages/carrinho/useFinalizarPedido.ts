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

interface UseFinalizarPedidoOptions {
  items: CartItem[];
  onOrderCreated: () => void;
}

export function useFinalizarPedido({
  items,
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
      try {
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

        setLoading(true);

        const payload = {
          items: items.map(
            (item) => ({
              produtoId: item.id,
              quantity:
                item.quantity,
            }),
          ),
        };

        await api.post(
          '/pedidos',
          payload,
        );

        onOrderCreated();

        setSuccess(
          'Pedido criado com sucesso!',
        );

        window.setTimeout(() => {
          navigate(
            '/meus-pedidos',
            {
              replace: true,
            },
          );
        }, 1200);
      } catch (requestError) {
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

        const apiMessage =
          axiosError.response?.data
            ?.message;

        if (
          Array.isArray(apiMessage)
        ) {
          setError(
            apiMessage.join(' '),
          );

          return;
        }

        setError(
          apiMessage ||
            axiosError.response
              ?.data?.error ||
            'Erro ao finalizar pedido. Verifique o estoque dos produtos e tente novamente.',
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