import type {
  AxiosError,
} from 'axios';
import {
  useState,
} from 'react';

import {
  api,
} from '../../services/api';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface CheckoutResponse {
  pedidoId: number;
  preferenceId: string;
  checkoutUrl: string;
}

interface PedidoPaymentActionProps {
  pedidoId: number;
  status: string;
}

function getApiErrorMessage(
  error: AxiosError<ApiErrorResponse>,
) {
  const message =
    error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  return (
    message ||
    error.response?.data?.error ||
    'Não foi possível iniciar o pagamento. Tente novamente.'
  );
}

export function PedidoPaymentAction({
  pedidoId,
  status,
}: PedidoPaymentActionProps) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  if (status !== 'PENDENTE') {
    return null;
  }

  const handlePayment =
    async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await api.post<CheckoutResponse>(
            `/pagamentos/pedidos/${pedidoId}/checkout`,
          );

        const checkoutUrl =
          response.data.checkoutUrl;

        if (!checkoutUrl) {
          setError(
            'O Mercado Pago não retornou a página de pagamento.',
          );

          return;
        }

        window.location.assign(
          checkoutUrl,
        );
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao iniciar pagamento:',
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
          ),
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section className="mb-8 rounded-3xl border border-amber-300 bg-white p-6 shadow-xl dark:border-amber-800 dark:bg-gray-900">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-300">
            Pagamento pendente
          </p>

          <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
            Finalize o pagamento do pedido
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Você será direcionado para o
            ambiente seguro do Mercado
            Pago para concluir o
            pagamento.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void handlePayment();
          }}
          disabled={loading}
          className="inline-flex min-w-48 items-center justify-center gap-2 rounded-2xl bg-amber-600 px-6 py-4 font-black text-white shadow-lg transition hover:bg-amber-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

              Abrindo...
            </>
          ) : (
            <>
              💳 Pagar pedido
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}
    </section>
  );
}