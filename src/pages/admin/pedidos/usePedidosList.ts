import type { AxiosError } from 'axios';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Pedido } from '../../../types/pedido';

import {
  fetchPedidosApi,
} from './pedido.api';

import {
  initialPagination,
} from './pedido.constants';

import type {
  ApiErrorResponse,
} from './pedido.types';

import {
  getErrorMessage,
} from './pedido.utils';

export function usePedidosList() {
  const [pedidos, setPedidos] =
    useState<Pedido[]>([]);

  const [pagination, setPagination] =
    useState(initialPagination);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const pedidosPendentesNaPagina =
    useMemo(() => {
      return pedidos.filter(
        (pedido) =>
          pedido.status ===
          'PENDENTE',
      ).length;
    }, [pedidos]);

  const pedidosEntreguesNaPagina =
    useMemo(() => {
      return pedidos.filter(
        (pedido) =>
          pedido.status ===
          'ENTREGUE',
      ).length;
    }, [pedidos]);

  const faturamentoNaPagina =
    useMemo(() => {
      return pedidos.reduce(
        (total, pedido) =>
          total +
          (pedido.totalPrice || 0),
        0,
      );
    }, [pedidos]);

  const hasFilters = Boolean(
    search ||
      statusFilter,
  );

  const fetchPedidos =
    useCallback(async () => {
      try {
        setError('');
        setLoading(true);

        const data =
          await fetchPedidosApi({
            page,
            limit,
            search:
              search.trim() ||
              undefined,
            status:
              statusFilter ||
              undefined,
          });

        setPedidos(
          Array.isArray(data.content)
            ? data.content
            : [],
        );

        setPagination(
          data.pagination ||
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
      limit,
      page,
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
  }, [
    fetchPedidos,
    search,
  ]);

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (
    value: string,
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(1);
  };

  const handleLimitChange = (
    value: number,
  ) => {
    setLimit(value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (
      pagination.hasPreviousPage
    ) {
      setPage(
        (currentPage) =>
          currentPage - 1,
      );
    }
  };

  const handleNextPage = () => {
    if (
      pagination.hasNextPage
    ) {
      setPage(
        (currentPage) =>
          currentPage + 1,
      );
    }
  };

  return {
    pedidos,
    pagination,

    loading,
    error,

    search,
    statusFilter,
    limit,

    pedidosPendentesNaPagina,
    pedidosEntreguesNaPagina,
    faturamentoNaPagina,

    hasFilters,

    fetchPedidos,

    handleSearchChange,
    handleStatusFilterChange,
    handleClearFilters,
    handleLimitChange,
    handlePreviousPage,
    handleNextPage,
  };
}