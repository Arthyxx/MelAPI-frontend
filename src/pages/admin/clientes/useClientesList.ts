import type { AxiosError } from 'axios';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  fetchClientesApi,
} from './cliente.api';

import {
  initialPagination,
} from './cliente.constants';

import type {
  ActiveFilter,
  ApiErrorResponse,
  Cliente,
  ClienteRole,
} from './cliente.types';

import {
  getErrorMessage,
} from './cliente.utils';

export function useClientesList() {
  const [clientes, setClientes] =
    useState<Cliente[]>([]);

  const [pagination, setPagination] =
    useState(initialPagination);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<ClienteRole | ''>('');

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<ActiveFilter>('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const totalAdminsNaPagina =
    useMemo(() => {
      return clientes.filter(
        (cliente) =>
          cliente.role === 'ADMIN',
      ).length;
    }, [clientes]);

  const totalClientesNaPagina =
    useMemo(() => {
      return clientes.filter(
        (cliente) =>
          cliente.role === 'CLIENTE',
      ).length;
    }, [clientes]);

  const totalAtivosNaPagina =
    useMemo(() => {
      return clientes.filter(
        (cliente) =>
          cliente.active,
      ).length;
    }, [clientes]);

  const hasFilters = Boolean(
    search ||
      roleFilter ||
      activeFilter,
  );

  const fetchClientes =
    useCallback(async () => {
      try {
        setError('');
        setLoading(true);

        const data =
          await fetchClientesApi({
            page,
            limit,
            search:
              search.trim() ||
              undefined,
            role:
              roleFilter ||
              undefined,
            active:
              activeFilter ||
              undefined,
          });

        setClientes(
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
          'Erro ao carregar clientes:',
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

        setClientes([]);

        setPagination(
          initialPagination,
        );

        setError(
          getErrorMessage(
            axiosError,
            'Erro ao carregar clientes.',
          ),
        );
      } finally {
        setLoading(false);
      }
    }, [
      activeFilter,
      limit,
      page,
      roleFilter,
      search,
    ]);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          void fetchClientes();
        },
        search ? 350 : 0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    fetchClientes,
    search,
  ]);

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilterChange = (
    value: ClienteRole | '',
  ) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleActiveFilterChange = (
    value: ActiveFilter,
  ) => {
    setActiveFilter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setActiveFilter('');
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

  const refreshAfterSave =
    async () => {
      if (page !== 1) {
        setPage(1);
        return;
      }

      await fetchClientes();
    };

  const refreshAfterDelete =
    async () => {
      if (
        clientes.length === 1 &&
        page > 1
      ) {
        setPage(
          (currentPage) =>
            currentPage - 1,
        );

        return;
      }

      await fetchClientes();
    };

  return {
    clientes,
    pagination,

    loading,
    error,

    search,
    roleFilter,
    activeFilter,
    limit,

    totalAdminsNaPagina,
    totalClientesNaPagina,
    totalAtivosNaPagina,

    hasFilters,

    handleSearchChange,
    handleRoleFilterChange,
    handleActiveFilterChange,
    handleClearFilters,
    handleLimitChange,
    handlePreviousPage,
    handleNextPage,

    refreshAfterSave,
    refreshAfterDelete,
  };
}