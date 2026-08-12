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

type ClienteRole = 'ADMIN' | 'CLIENTE';

interface Cliente {
  id: number;
  name: string;
  email: string;
  role: ClienteRole;
  active: boolean;
  phone?: string | null;
  city?: string | null;
  createdAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ClientesResponse {
  content: Cliente[];
  pagination: Pagination;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

const initialFormData = {
  name: '',
  email: '',
  password: '',
  role: 'CLIENTE' as ClienteRole,
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

export function ClientesAdmin() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState(initialFormData);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] =
    useState<ClienteRole | ''>('');
  const [activeFilter, setActiveFilter] =
    useState<'true' | 'false' | ''>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clienteParaExcluir = clientes.find(
    (cliente) => cliente.id === deleteId,
  );

  const totalAdminsNaPagina = useMemo(() => {
    return clientes.filter(
      (cliente) => cliente.role === 'ADMIN',
    ).length;
  }, [clientes]);

  const totalClientesNaPagina = useMemo(() => {
    return clientes.filter(
      (cliente) => cliente.role === 'CLIENTE',
    ).length;
  }, [clientes]);

  const totalAtivosNaPagina = useMemo(() => {
    return clientes.filter(
      (cliente) => cliente.active,
    ).length;
  }, [clientes]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  const getErrorMessage = (
    requestError: AxiosError<ApiErrorResponse>,
    fallbackMessage: string,
  ) => {
    const apiMessage =
      requestError.response?.data?.message;

    if (Array.isArray(apiMessage)) {
      return apiMessage.join(' ');
    }

    return (
      apiMessage ||
      requestError.response?.data?.error ||
      fallbackMessage
    );
  };

  const fetchClientes = useCallback(async () => {
    try {
      setError('');
      setLoading(true);

      const response =
        await api.get<ClientesResponse>(
          '/clientes',
          {
            params: {
              page,
              limit,
              search:
                search.trim() || undefined,
              role:
                roleFilter || undefined,
              active:
                activeFilter || undefined,
            },
          },
        );

      setClientes(
        Array.isArray(response.data.content)
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
        'Erro ao carregar clientes:',
        {
          statusCode:
            axiosError.response?.status,
          data:
            axiosError.response?.data,
          message:
            axiosError.message,
        },
      );

      setClientes([]);
      setPagination(initialPagination);

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
    page,
    limit,
    search,
    roleFilter,
    activeFilter,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        void fetchClientes();
      },
      search ? 350 : 0,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchClientes, search]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      if (editingId !== null) {
        await api.patch(
          `/clientes/${editingId}`,
          {
            name: formData.name.trim(),
            email:
              formData.email
                .trim()
                .toLowerCase(),
            role: formData.role,
            active: formData.active,
            ...(formData.password
              ? {
                  password:
                    formData.password,
                }
              : {}),
          },
        );

        setSuccess(
          'Cliente atualizado com sucesso.',
        );
      } else {
        await api.post(
          '/clientes/admin',
          {
            name: formData.name.trim(),
            email:
              formData.email
                .trim()
                .toLowerCase(),
            password: formData.password,
            role: formData.role,
            active: formData.active,
          },
        );

        setSuccess(
          'Cliente criado com sucesso.',
        );
      }

      resetForm();
      setPage(1);

      await fetchClientes();
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error(
        'Erro ao salvar cliente:',
        {
          statusCode:
            axiosError.response?.status,
          data:
            axiosError.response?.data,
          message:
            axiosError.message,
        },
      );

      setError(
        getErrorMessage(
          axiosError,
          'Erro ao salvar cliente.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    cliente: Cliente,
  ) => {
    setError('');
    setSuccess('');
    setEditingId(cliente.id);

    setFormData({
      name: cliente.name,
      email: cliente.email,
      password: '',
      role: cliente.role,
      active: cliente.active,
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
          `/clientes/${deleteId}`,
        );

        setSuccess(
          'Operação concluída. O cliente foi excluído ou desativado para preservar o histórico.',
        );

        setDeleteId(null);

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
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao excluir cliente:',
          {
            statusCode:
              axiosError.response?.status,
            data:
              axiosError.response?.data,
            message:
              axiosError.message,
          },
        );

        setError(
          getErrorMessage(
            axiosError,
            'Erro ao excluir cliente.',
          ),
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setActiveFilter('');
    setPage(1);
  };

  const hasFilters = Boolean(
    search ||
      roleFilter ||
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
            Clientes
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Gerencie contas de clientes e
            administradores.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-950">
              {pagination.totalItems}
            </p>

            <p className="text-xs font-bold text-gray-500">
              Encontrados
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-2xl font-black text-blue-700">
              {totalClientesNaPagina}
            </p>

            <p className="text-xs font-bold text-blue-700">
              Clientes na página
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">
            <p className="text-2xl font-black text-purple-700">
              {totalAdminsNaPagina}
            </p>

            <p className="text-xs font-bold text-purple-700">
              Admins na página
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-2xl font-black text-green-700">
              {totalAtivosNaPagina}
            </p>

            <p className="text-xs font-bold text-green-700">
              Ativos na página
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
        <div className="mb-5 flex flex-col gap-1">
          <h3 className="text-xl font-black text-gray-950">
            {editingId !== null
              ? 'Editar cliente'
              : 'Novo cliente'}
          </h3>

          <p className="text-sm text-gray-500">
            Controle os dados básicos, o nível
            de acesso e o status da conta.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 lg:grid-cols-4"
        >
          <div>
            <label
              htmlFor="cliente-name"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Nome
            </label>

            <input
              id="cliente-name"
              type="text"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  name: event.target.value,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="cliente-email"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              E-mail
            </label>

            <input
              id="cliente-email"
              type="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  email:
                    event.target.value,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="cliente-password"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              {editingId !== null
                ? 'Nova senha'
                : 'Senha'}
            </label>

            <input
              id="cliente-password"
              type="password"
              placeholder={
                editingId !== null
                  ? 'Deixe vazio para manter'
                  : 'Senha inicial'
              }
              value={formData.password}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  password:
                    event.target.value,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required={editingId === null}
            />
          </div>

          <div>
            <label
              htmlFor="cliente-role"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Perfil
            </label>

            <select
              id="cliente-role"
              value={formData.role}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  role:
                    event.target
                      .value as ClienteRole,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="CLIENTE">
                Cliente
              </option>

              <option value="ADMIN">
                Administrador
              </option>
            </select>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 lg:col-span-4">
            <input
              id="cliente-active"
              type="checkbox"
              checked={formData.active}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  active:
                    event.target.checked,
                })
              }
              className="h-4 w-4 accent-amber-700"
            />

            <label
              htmlFor="cliente-active"
              className="text-sm font-bold text-gray-700"
            >
              Conta ativa e autorizada a
              entrar no sistema
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
                : editingId !== null
                  ? 'Salvar alterações'
                  : 'Criar cliente'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
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
            Buscar clientes
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Pesquise por nome, e-mail, telefone
            ou cidade.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr_1fr_auto]">
          <div>
            <label
              htmlFor="clientes-search"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Busca
            </label>

            <input
              id="clientes-search"
              type="search"
              placeholder="Nome, e-mail, telefone ou cidade"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="clientes-role-filter"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Perfil
            </label>

            <select
              id="clientes-role-filter"
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(
                  event.target
                    .value as ClienteRole | '',
                );
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="">
                Todos
              </option>

              <option value="CLIENTE">
                Clientes
              </option>

              <option value="ADMIN">
                Administradores
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="clientes-active-filter"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Status
            </label>

            <select
              id="clientes-active-filter"
              value={activeFilter}
              onChange={(event) => {
                setActiveFilter(
                  event.target.value as
                    | 'true'
                    | 'false'
                    | '',
                );
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="">
                Todos
              </option>

              <option value="true">
                Ativos
              </option>

              <option value="false">
                Inativos
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleClearFilters}
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
              Clientes cadastrados
            </h3>

            <p className="text-sm text-gray-500">
              Página {pagination.page} de{' '}
              {pagination.totalPages} —{' '}
              {pagination.totalItems}{' '}
              resultado(s).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="clientes-limit"
              className="text-sm font-bold text-gray-600"
            >
              Por página:
            </label>

            <select
              id="clientes-limit"
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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

            <p className="mt-4 font-semibold text-gray-600">
              Carregando clientes...
            </p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhum cliente encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">
                    Cliente
                  </th>

                  <th className="px-6 py-4">
                    Contato
                  </th>

                  <th className="px-6 py-4">
                    Perfil
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
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-sm font-black text-gray-700">
                          {cliente.name
                            ?.split(' ')
                            .slice(0, 2)
                            .map(
                              (part) =>
                                part[0],
                            )
                            .join('')
                            .toUpperCase() ||
                            'CL'}
                        </div>

                        <div>
                          <p className="font-black text-gray-900">
                            {cliente.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            ID #{cliente.id}
                            {cliente.city
                              ? ` • ${cliente.city}`
                              : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {cliente.email}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {cliente.phone ||
                          'Telefone não informado'}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          cliente.role ===
                          'ADMIN'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {cliente.role ===
                        'ADMIN'
                          ? 'Administrador'
                          : 'Cliente'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          cliente.active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cliente.active
                          ? 'Ativo'
                          : 'Inativo'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              cliente,
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
                              cliente.id,
                            )
                          }
                          className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-black text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-gray-500">
            Mostrando {clientes.length} de{' '}
            {pagination.totalItems}{' '}
            resultado(s).
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setPage(
                  (currentPage) =>
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
              {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage(
                  (currentPage) =>
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

      <ConfirmModal
        open={deleteId !== null}
        title="Excluir ou desativar cliente?"
        description={`O cliente "${
          clienteParaExcluir?.name ||
          'selecionado'
        }" será excluído definitivamente quando não possuir histórico. Caso tenha pedidos, a conta será desativada e os registros serão preservados.`}
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