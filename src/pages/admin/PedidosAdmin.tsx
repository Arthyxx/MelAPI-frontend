import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AxiosError } from 'axios';

import {
  statusPedidoColors,
  statusPedidoLabels,
  statusPedidoOptions,
} from '../../constants/statusPedido';
import { api } from '../../services/api';
import type { Pedido } from '../../types/pedido';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PedidosResponse {
  content: Pedido[];
  pagination: Pagination;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export function PedidosAdmin() {
  const [pedidos, setPedidos] =
    useState<Pedido[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>(
      initialPagination,
    );

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const pedidosPendentesNaPagina =
    useMemo(() => {
      return pedidos.filter(
        (pedido) =>
          pedido.status === 'PENDENTE',
      ).length;
    }, [pedidos]);

  const pedidosEntreguesNaPagina =
    useMemo(() => {
      return pedidos.filter(
        (pedido) =>
          pedido.status === 'ENTREGUE',
      ).length;
    }, [pedidos]);

  const faturamentoNaPagina =
    useMemo(() => {
      return pedidos.reduce(
        (sum, pedido) =>
          sum +
          (pedido.totalPrice || 0),
        0,
      );
    }, [pedidos]);

  const getErrorMessage = (
    requestError: AxiosError<ApiErrorResponse>,
    fallbackMessage: string,
  ) => {
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
  };

  const fetchPedidos =
    useCallback(async () => {
      try {
        setError('');
        setLoading(true);

        const response =
          await api.get<PedidosResponse>(
            '/pedidos',
            {
              params: {
                page,
                limit,
                search:
                  search.trim() ||
                  undefined,
                status:
                  statusFilter ||
                  undefined,
              },
            },
          );

        setPedidos(
          Array.isArray(
            response.data.content,
          )
            ? response.data.content
            : [],
        );

        setPagination(
          response.data.pagination ||
            initialPagination,
        );
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao carregar pedidos:',
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

        setPedidos([]);
        setPagination(
          initialPagination,
        );

        setError(
          getErrorMessage(
            axiosError,
            'Erro ao carregar pedidos.',
          ),
        );
      } finally {
        setLoading(false);
      }
    }, [
      page,
      limit,
      search,
      statusFilter,
    ]);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          void fetchPedidos();
        },
        search ? 350 : 0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [fetchPedidos, search]);

  const updateStatus = async (
    id: number,
    status: string,
  ) => {
    try {
      setError('');
      setSuccess('');
      setUpdatingId(id);

      await api.patch(
        `/pedidos/${id}/status`,
        {
          status,
        },
      );

      setSuccess(
        `Status do pedido #${id} atualizado com sucesso.`,
      );

      await fetchPedidos();
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

  const handleClearFilters =
    () => {
      setSearch('');
      setStatusFilter('');
      setPage(1);
    };

  const hasFilters = Boolean(
    search || statusFilter,
  );

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
            Administração
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
            Pedidos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Acompanhe pedidos,
            produtos comprados e
            status de entrega.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-950">
              {
                pagination.totalItems
              }
            </p>

            <p className="text-xs font-bold text-gray-500">
              Encontrados
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-2xl font-black text-amber-700">
              {
                pedidosPendentesNaPagina
              }
            </p>

            <p className="text-xs font-bold text-amber-700">
              Pendentes na página
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-2xl font-black text-green-700">
              {
                pedidosEntreguesNaPagina
              }
            </p>

            <p className="text-xs font-bold text-green-700">
              Entregues na página
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-lg font-black text-blue-700">
              {formatCurrency(
                faturamentoNaPagina,
              )}
            </p>

            <p className="text-xs font-bold text-blue-700">
              Total da página
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-gray-950">
            Buscar pedidos
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Pesquise pelo número do
            pedido, nome ou e-mail do
            cliente.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr_auto]">
          <div>
            <label
              htmlFor="pedidos-search"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Busca
            </label>

            <input
              id="pedidos-search"
              type="search"
              placeholder="Pedido, cliente ou e-mail"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value,
                );
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="pedidos-status-filter"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Status
            </label>

            <select
              id="pedidos-status-filter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value,
                );
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="">
                Todos
              </option>

              {statusPedidoOptions.map(
                (statusOption) => (
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

          <div className="flex items-end">
            <button
              type="button"
              onClick={
                handleClearFilters
              }
              disabled={!hasFilters}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-5 font-black text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-950">
              Pedidos recebidos
            </h3>

            <p className="text-sm text-gray-500">
              Página{' '}
              {pagination.page} de{' '}
              {
                pagination.totalPages
              }{' '}
              —{' '}
              {
                pagination.totalItems
              }{' '}
              resultado(s).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="pedidos-limit"
              className="text-sm font-bold text-gray-600"
            >
              Por página:
            </label>

            <select
              id="pedidos-limit"
              value={limit}
              onChange={(event) => {
                setLimit(
                  Number(
                    event.target.value,
                  ),
                );
                setPage(1);
              }}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold outline-none focus:border-amber-400"
            >
              <option value={5}>
                5
              </option>

              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

            <p className="mt-4 font-semibold text-gray-600">
              Carregando pedidos...
            </p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] border-collapse">
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
                {pedidos.map(
                  (pedido) => {
                    const status =
                      pedido.status ??
                      'PENDENTE';

                    const isUpdating =
                      updatingId ===
                      pedido.id;

                    return (
                      <tr
                        key={pedido.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-black text-gray-900">
                              Pedido #
                              {
                                pedido.id
                              }
                            </p>

                            <p className="text-xs text-gray-500">
                              {pedido
                                .items
                                ?.length ||
                                0}{' '}
                              {(pedido
                                .items
                                ?.length ||
                                0) ===
                              1
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
                              {
                                pedido.clienteEmail
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID #
                              {
                                pedido.clienteId
                              }
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="max-w-sm space-y-2">
                            {pedido.items
                              ?.length >
                            0 ? (
                              pedido.items.map(
                                (
                                  item,
                                ) => (
                                  <div
                                    key={
                                      item.id
                                    }
                                    className="rounded-2xl bg-gray-50 px-3 py-2 text-sm"
                                  >
                                    <span className="font-black text-gray-800">
                                      {
                                        item.produtoName
                                      }
                                    </span>

                                    <span className="ml-2 text-gray-500">
                                      x
                                      {
                                        item.quantity
                                      }
                                    </span>
                                  </div>
                                ),
                              )
                            ) : (
                              <span className="text-sm text-gray-500">
                                Nenhum
                                item
                                informado
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-black text-amber-700">
                          {formatCurrency(
                            pedido.totalPrice,
                          )}
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
                            ] ||
                              status}
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
                              value={
                                pedido.status
                              }
                              onChange={(
                                event,
                              ) =>
                                void updateStatus(
                                  pedido.id,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              disabled={
                                isUpdating
                              }
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
                  },
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-gray-500">
            Mostrando{' '}
            {pedidos.length} de{' '}
            {
              pagination.totalItems
            }{' '}
            resultado(s).
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setPage(
                  (
                    currentPage,
                  ) =>
                    currentPage - 1,
                )
              }
              disabled={
                loading ||
                !pagination.hasPreviousPage
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="flex min-w-24 items-center justify-center rounded-xl bg-gray-50 px-4 py-2 text-sm font-black text-gray-700">
              {pagination.page} /{' '}
              {
                pagination.totalPages
              }
            </span>

            <button
              type="button"
              onClick={() =>
                setPage(
                  (
                    currentPage,
                  ) =>
                    currentPage + 1,
                )
              }
              disabled={
                loading ||
                !pagination.hasNextPage
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}