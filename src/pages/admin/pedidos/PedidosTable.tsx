import {
  statusPedidoColors,
  statusPedidoLabels,
  statusPedidoOptions,
} from '../../../constants/statusPedido';

import type { Pedido } from '../../../types/pedido';

import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

interface PedidosTableProps {
  pedidos: Pedido[];
  loading: boolean;
  updatingId: number | null;
  onUpdateStatus: (
    pedidoId: number,
    status: string,
  ) => void;
}

export function PedidosTable({
  pedidos,
  loading,
  updatingId,
  onUpdateStatus,
}: PedidosTableProps) {
  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando pedidos...
        </p>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Nenhum pedido encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1320px] border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
            <th className="px-6 py-4">
              Pedido
            </th>

            <th className="px-6 py-4">
              Cliente
            </th>

            <th className="px-6 py-4">
              Produtos
            </th>

            <th className="px-6 py-4">
              Frete
            </th>

            <th className="px-6 py-4">
              Total
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th className="px-6 py-4">
              Data
            </th>

            <th className="px-6 py-4 text-right">
              Atualizar
            </th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map((pedido) => {
            const status =
              pedido.status ?? 'PENDENTE';

            const isUpdating =
              updatingId === pedido.id;

            const hasShipping =
              Boolean(
                pedido.shipping
                  .serviceName ||
                  pedido.shipping
                    .companyName,
              );

            return (
              <tr
                key={pedido.id}
                className="border-b border-gray-100 transition hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-black text-gray-900">
                      Pedido #{pedido.id}
                    </p>

                    <p className="text-xs text-gray-500">
                      {pedido.items
                        ?.length || 0}{' '}
                      {(pedido.items
                        ?.length ||
                        0) === 1
                        ? 'produto'
                        : 'produtos'}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div>
                    <p className="font-black text-gray-900">
                      {pedido.clienteName ||
                        'Cliente não informado'}
                    </p>

                    <p className="text-xs font-medium text-gray-500">
                      {pedido.clienteEmail}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      ID #{pedido.clienteId}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="max-w-sm space-y-2">
                    {pedido.items
                      ?.length > 0 ? (
                      pedido.items.map(
                        (item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl bg-gray-50 px-3 py-2 text-sm"
                          >
                            <span className="font-black text-gray-800">
                              {
                                item.produtoName
                              }
                            </span>

                            <span className="ml-2 text-gray-500">
                              x
                              {item.quantity}
                            </span>
                          </div>
                        ),
                      )
                    ) : (
                      <span className="text-sm text-gray-500">
                        Nenhum item
                        informado
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {hasShipping ? (
                    <div className="min-w-44">
                      <p className="font-black text-gray-900">
                        🚚{' '}
                        {pedido.shipping
                          .companyName ||
                          'Transportadora'}
                      </p>

                      {pedido.shipping
                        .serviceName && (
                        <p className="mt-1 text-xs font-medium text-gray-500">
                          {
                            pedido
                              .shipping
                              .serviceName
                          }
                        </p>
                      )}

                      <p className="mt-2 text-sm font-black text-amber-700">
                        {formatCurrency(
                          pedido.shippingPrice,
                        )}
                      </p>

                      {pedido.shipping
                        .deliveryTime !==
                        null && (
                        <p className="mt-1 text-xs text-gray-500">
                          Prazo:{' '}
                          {
                            pedido
                              .shipping
                              .deliveryTime
                          }{' '}
                          {pedido.shipping
                            .deliveryTime ===
                          1
                            ? 'dia útil'
                            : 'dias úteis'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Não registrado
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div>
                    <p className="font-black text-amber-700">
                      {formatCurrency(
                        pedido.totalPrice,
                      )}
                    </p>

                    {hasShipping && (
                      <p className="mt-1 text-xs text-gray-400">
                        Frete incluso
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${
                      statusPedidoColors[
                        status
                      ] ||
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusPedidoLabels[
                      status
                    ] || status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                  {formatDate(
                    pedido.createdAt,
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <select
                      value={pedido.status}
                      onChange={(
                        event,
                      ) =>
                        onUpdateStatus(
                          pedido.id,
                          event.target
                            .value,
                        )
                      }
                      disabled={isUpdating}
                      className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {statusPedidoOptions.map(
                        (
                          statusOption,
                        ) => (
                          <option
                            key={
                              statusOption.value
                            }
                            value={
                              statusOption.value
                            }
                          >
                            {
                              statusOption.label
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {isUpdating && (
                    <p className="mt-2 text-right text-xs font-bold text-amber-700">
                      Atualizando...
                    </p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
