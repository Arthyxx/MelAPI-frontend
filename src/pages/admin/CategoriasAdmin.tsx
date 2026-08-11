import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import type { AxiosError } from 'axios';

import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { api } from '../../services/api';

interface Categoria {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CategoriasResponse {
  content: Categoria[];
  pagination: Pagination;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

const initialFormData = {
  name: '',
  description: '',
  active: true,
};

const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export function CategoriasAdmin() {
  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState(initialFormData);

  const [search, setSearch] =
    useState('');

  const [activeFilter, setActiveFilter] =
    useState<'true' | 'false' | ''>('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const categoriaParaExcluir =
    categorias.find(
      (categoria) =>
        categoria.id === deleteId,
    );

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

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  const getErrorMessage = (
    requestError:
      AxiosError<ApiErrorResponse>,
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

  const fetchCategorias =
    useCallback(async () => {
      try {
        setError('');
        setLoading(true);

        const response =
          await api.get<CategoriasResponse>(
            '/categorias/admin',
            {
              params: {
                page,
                limit,
                search:
                  search.trim() ||
                  undefined,
                active:
                  activeFilter ||
                  undefined,
              },
            },
          );

        setCategorias(
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
      page,
      limit,
      search,
      activeFilter,
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

  useEffect(() => {
    setPage(1);
  }, [
    search,
    activeFilter,
    limit,
  ]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      const payload = {
        name:
          formData.name.trim(),
        description:
          formData.description.trim() ||
          undefined,
        active:
          formData.active,
      };

      if (editingId !== null) {
        await api.put(
          `/categorias/${editingId}`,
          payload,
        );

        setSuccess(
          'Categoria atualizada com sucesso.',
        );

        resetForm();

        await fetchCategorias();

        return;
      }

      await api.post(
        '/categorias',
        payload,
      );

      setSuccess(
        'Categoria criada com sucesso.',
      );

      resetForm();

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchCategorias();
      }
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error(
        'Erro ao salvar categoria:',
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
          'Erro ao salvar categoria.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    categoria: Categoria,
  ) => {
    setError('');
    setSuccess('');

    setEditingId(
      categoria.id,
    );

    setFormData({
      name:
        categoria.name,
      description:
        categoria.description ||
        '',
      active:
        categoria.active,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleConfirmDelete =
    async () => {
      if (deleteId === null) {
        return;
      }

      try {
        setError('');
        setSuccess('');
        setDeleting(true);

        await api.delete(
          `/categorias/${deleteId}`,
        );

        setSuccess(
          'Categoria excluída ou desativada com sucesso.',
        );

        setDeleteId(null);

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
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao excluir categoria:',
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
            'Erro ao excluir categoria.',
          ),
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleClearFilters = () => {
    setSearch('');
    setActiveFilter('');
    setPage(1);
  };

  const hasFilters =
    Boolean(
      search ||
        activeFilter,
    );

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
            Administração
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
            Categorias
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Organize os tipos de produtos exibidos na loja.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-950">
              {
                pagination.totalItems
              }
            </p>

            <p className="text-xs font-bold text-gray-500">
              Encontradas
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-2xl font-black text-green-700">
              {
                categoriasAtivasNaPagina
              }
            </p>

            <p className="text-xs font-bold text-green-700">
              Ativas na página
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-600">
              {
                categoriasInativasNaPagina
              }
            </p>

            <p className="text-xs font-bold text-gray-500">
              Inativas na página
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
        <div className="mb-5">
          <h3 className="text-xl font-black text-gray-950">
            {editingId !== null
              ? 'Editar categoria'
              : 'Nova categoria'}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Use categorias para organizar a vitrine e facilitar a navegação dos clientes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-black text-gray-700">
              Nome
            </label>

            <input
              type="text"
              placeholder="Ex: Mel Puro"
              value={
                formData.name
              }
              onChange={(
                event,
              ) =>
                setFormData({
                  ...formData,
                  name:
                    event.target
                      .value,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-black text-gray-700">
              Descrição
            </label>

            <input
              type="text"
              placeholder="Descrição breve da categoria"
              value={
                formData.description
              }
              onChange={(
                event,
              ) =>
                setFormData({
                  ...formData,
                  description:
                    event.target
                      .value,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 lg:col-span-4">
            <input
              id="categoria-active"
              type="checkbox"
              checked={
                formData.active
              }
              onChange={(
                event,
              ) =>
                setFormData({
                  ...formData,
                  active:
                    event.target
                      .checked,
                })
              }
              className="h-4 w-4 accent-amber-700"
            />

            <label
              htmlFor="categoria-active"
              className="text-sm font-bold text-gray-700"
            >
              Categoria ativa na loja
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-amber-700 px-6 py-3 font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Salvando...'
                : editingId !==
                    null
                  ? 'Salvar alterações'
                  : 'Criar categoria'}
            </button>

            {editingId !==
              null && (
              <button
                type="button"
                onClick={
                  resetForm
                }
                disabled={
                  saving
                }
                className="rounded-2xl border border-gray-200 bg-white px-6 py-3 font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-gray-950">
            Buscar categorias
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Pesquise pelo nome ou descrição e filtre pelo status.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Busca
            </label>

            <input
              type="search"
              placeholder="Nome ou descrição"
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Status
            </label>

            <select
              value={
                activeFilter
              }
              onChange={(
                event,
              ) =>
                setActiveFilter(
                  event.target
                    .value as
                    | 'true'
                    | 'false'
                    | '',
                )
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="">
                Todas
              </option>

              <option value="true">
                Ativas
              </option>

              <option value="false">
                Inativas
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={
                handleClearFilters
              }
              disabled={
                !hasFilters
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-5 font-black text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              Categorias cadastradas
            </h3>

            <p className="text-sm text-gray-500">
              Página{' '}
              {pagination.page}{' '}
              de{' '}
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
            <label className="text-sm font-bold text-gray-600">
              Por página:
            </label>

            <select
              value={limit}
              onChange={(
                event,
              ) =>
                setLimit(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
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
              Carregando categorias...
            </p>
          </div>
        ) : categorias.length ===
          0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhuma categoria encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">
                    Categoria
                  </th>

                  <th className="px-6 py-4">
                    Descrição
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {categorias.map(
                  (categoria) => (
                    <tr
                      key={
                        categoria.id
                      }
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                            🏷️
                          </div>

                          <div>
                            <p className="font-black text-gray-900">
                              {
                                categoria.name
                              }
                            </p>

                            <p className="text-xs text-gray-500">
                              ID #
                              {
                                categoria.id
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {categoria.description ||
                          'Sem descrição'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            categoria.active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {categoria.active
                            ? 'Ativa'
                            : 'Inativa'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                categoria,
                              )
                            }
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteId(
                                categoria.id,
                              )
                            }
                            className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-black text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-gray-500">
            Mostrando{' '}
            {categorias.length}{' '}
            de{' '}
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
                    currentPage -
                    1,
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
              {
                pagination.page
              }{' '}
              /{' '}
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
                    currentPage +
                    1,
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

      <ConfirmModal
        open={
          deleteId !== null
        }
        title="Excluir categoria?"
        description={`A categoria "${
          categoriaParaExcluir?.name ||
          'selecionada'
        }" será excluída definitivamente se não possuir produtos vinculados. Caso possua produtos, a categoria e os produtos ativos vinculados serão desativados para preservar o histórico.`}
        confirmText={
          deleting
            ? 'Processando...'
            : 'Confirmar'
        }
        cancelText="Cancelar"
        variant="danger"
        onConfirm={
          handleConfirmDelete
        }
        onCancel={() => {
          if (!deleting) {
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}