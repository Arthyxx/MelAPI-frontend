import type { AxiosError } from 'axios';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  fetchCategoriasApi,
} from './categoria.api';

import {
  initialPagination,
} from './categoria.constants';

import type {
  ActiveFilter,
  ApiErrorResponse,
  Categoria,
} from './categoria.types';

import {
  getErrorMessage,
} from './categoria.utils';

export function useCategoriasList() {
  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [pagination, setPagination] =
    useState(initialPagination);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<ActiveFilter>('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const categoriasAtivasNaPagina =
    useMemo(() => {
      return categorias.filter(
        (categoria) =>
          categoria.active,
      ).length;
    }, [categorias]);

  const categoriasInativasNaPagina =
    useMemo(() => {
      return categorias.filter(
        (categoria) =>
          !categoria.active,
      ).length;
    }, [categorias]);

  const hasFilters = Boolean(
    search ||
      activeFilter,
  );

  const fetchCategorias =
    useCallback(async () => {
      try {
        setError('');
        setLoading(true);

        const data =
          await fetchCategoriasApi({
            page,
            limit,
            search:
              search.trim() ||
              undefined,
            active:
              activeFilter ||
              undefined,
          });

        setCategorias(
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
          'Erro ao carregar categorias:',
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

        setCategorias([]);

        setPagination(
          initialPagination,
        );

        setError(
          getErrorMessage(
            axiosError,
            'Erro ao carregar categorias.',
          ),
        );
      } finally {
        setLoading(false);
      }
    }, [
      activeFilter,
      limit,
      page,
      search,
    ]);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          void fetchCategorias();
        },
        search ? 350 : 0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    fetchCategorias,
    search,
  ]);

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
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

  const refreshAfterCreate =
    async () => {
      if (page !== 1) {
        setPage(1);
        return;
      }

      await fetchCategorias();
    };

  const refreshAfterUpdate =
    async () => {
      await fetchCategorias();
    };

  const refreshAfterDelete =
    async () => {
      if (
        categorias.length === 1 &&
        page > 1
      ) {
        setPage(
          (currentPage) =>
            currentPage - 1,
        );

        return;
      }

      await fetchCategorias();
    };

  return {
    categorias,
    pagination,

    loading,
    error,

    search,
    activeFilter,
    limit,

    categoriasAtivasNaPagina,
    categoriasInativasNaPagina,

    hasFilters,

    handleSearchChange,
    handleActiveFilterChange,
    handleClearFilters,
    handleLimitChange,
    handlePreviousPage,
    handleNextPage,

    refreshAfterCreate,
    refreshAfterUpdate,
    refreshAfterDelete,
  };
}