import type { AxiosError } from 'axios';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  fetchCategoriasApi,
  fetchProdutosApi,
} from './produto.api';

import {
  initialPagination,
} from './produto.constants';

import type {
  ActiveFilter,
  ApiErrorResponse,
  Categoria,
  Produto,
} from './produto.types';

import {
  getErrorMessage,
} from './produto.utils';

export function useProdutosList() {
  const [produtos, setProdutos] =
    useState<Produto[]>([]);

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
    categoryFilter,
    setCategoryFilter,
  ] = useState('');

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<ActiveFilter>('');

  const [sort, setSort] =
    useState('id,asc');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const produtosAtivosNaPagina =
    useMemo(() => {
      return produtos.filter(
        (produto) =>
          produto.active,
      ).length;
    }, [produtos]);

  const produtosSemEstoqueNaPagina =
    useMemo(() => {
      return produtos.filter(
        (produto) =>
          produto.stockQuantity <= 0,
      ).length;
    }, [produtos]);

  const hasFilters = Boolean(
    search ||
      categoryFilter ||
      activeFilter ||
      sort !== 'id,asc',
  );

  const fetchProdutos =
    useCallback(async () => {
      try {
        setError('');
        setLoading(true);

        const data =
          await fetchProdutosApi({
            page,
            limit,
            name:
              search.trim() ||
              undefined,
            categoryId:
              categoryFilter ||
              undefined,
            active:
              activeFilter ||
              undefined,
            sort,
          });

        setProdutos(
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
          'Erro ao carregar produtos:',
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

        setProdutos([]);
        setPagination(
          initialPagination,
        );

        setError(
          getErrorMessage(
            axiosError,
            'Erro ao carregar produtos.',
          ),
        );
      } finally {
        setLoading(false);
      }
    }, [
      activeFilter,
      categoryFilter,
      limit,
      page,
      search,
      sort,
    ]);

  useEffect(() => {
    const fetchCategorias =
      async () => {
        try {
          const data =
            await fetchCategoriasApi();

          setCategorias(data);
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

          setError(
            getErrorMessage(
              axiosError,
              'Erro ao carregar categorias.',
            ),
          );
        }
      };

    void fetchCategorias();
  }, []);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          void fetchProdutos();
        },
        search ? 350 : 0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    fetchProdutos,
    search,
  ]);

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryFilterChange =
    (value: string) => {
      setCategoryFilter(value);
      setPage(1);
    };

  const handleActiveFilterChange =
    (value: ActiveFilter) => {
      setActiveFilter(value);
      setPage(1);
    };

  const handleSortChange = (
    value: string,
  ) => {
    setSort(value);
    setPage(1);
  };

  const handleClearFilters =
    () => {
      setSearch('');
      setCategoryFilter('');
      setActiveFilter('');
      setSort('id,asc');
      setPage(1);
    };

  const handleLimitChange = (
    value: number,
  ) => {
    setLimit(value);
    setPage(1);
  };

  const handlePreviousPage =
    () => {
      if (
        pagination.hasPreviousPage
      ) {
        setPage(
          (currentPage) =>
            currentPage - 1,
        );
      }
    };

  const handleNextPage =
    () => {
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

      await fetchProdutos();
    };

  const refreshAfterUpdate =
    async () => {
      await fetchProdutos();
    };

  const refreshAfterDelete =
    async () => {
      if (
        produtos.length === 1 &&
        page > 1
      ) {
        setPage(
          (currentPage) =>
            currentPage - 1,
        );

        return;
      }

      await fetchProdutos();
    };

  return {
    produtos,
    categorias,
    pagination,

    loading,
    error,

    search,
    categoryFilter,
    activeFilter,
    sort,
    limit,

    produtosAtivosNaPagina,
    produtosSemEstoqueNaPagina,
    hasFilters,

    handleSearchChange,
    handleCategoryFilterChange,
    handleActiveFilterChange,
    handleSortChange,
    handleClearFilters,
    handleLimitChange,
    handlePreviousPage,
    handleNextPage,

    refreshAfterCreate,
    refreshAfterUpdate,
    refreshAfterDelete,
  };
}