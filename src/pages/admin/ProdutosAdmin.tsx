import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import type { AxiosError } from 'axios';

import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  active: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface Categoria {
  id: number;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProdutosResponse {
  content: Produto[];
  pagination: Pagination;
}

interface ImageUploadResponse {
  imageUrl: string;
  imagePublicId: string;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

const initialFormData = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  categoryId: '',
  imageUrl: '',
  imagePublicId: '',
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

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export function ProdutosAdmin() {
  const [produtos, setProdutos] =
    useState<Produto[]>([]);

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>(
      initialPagination,
    );

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

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<File | null>(null);

  const [search, setSearch] =
    useState('');

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState('');

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<
    'true' | 'false' | ''
  >('');

  const [sort, setSort] =
    useState('id,asc');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const produtoParaExcluir =
    produtos.find(
      (produto) =>
        produto.id === deleteId,
    );

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
          produto.stockQuantity <=
          0,
      ).length;
    }, [produtos]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setSelectedImage(null);
  };

  const getErrorMessage = (
    requestError:
      AxiosError<ApiErrorResponse>,
    fallbackMessage: string,
  ) => {
    const apiMessage =
      requestError.response?.data
        ?.message;

    if (
      Array.isArray(apiMessage)
    ) {
      return apiMessage.join(' ');
    }

    return (
      apiMessage ||
      requestError.response
        ?.data?.error ||
      fallbackMessage
    );
  };

  const fetchProdutos =
    useCallback(async () => {
      try {
        setError('');
        setLoading(true);

        const response =
          await api.get<ProdutosResponse>(
            '/produtos/admin',
            {
              params: {
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
              },
            },
          );

        setProdutos(
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
      page,
      limit,
      search,
      categoryFilter,
      activeFilter,
      sort,
    ]);

  useEffect(() => {
    const fetchCategorias =
      async () => {
        try {
          const response =
            await api.get(
              '/categorias',
            );

          const content =
            response.data.content ||
            response.data;

          setCategorias(
            Array.isArray(content)
              ? content
              : [],
          );
        } catch (requestError) {
          console.error(
            'Erro ao carregar categorias:',
            requestError,
          );

          setError(
            'Erro ao carregar categorias.',
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

  const handleImageChange = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    setError('');
    setSuccess('');

    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      setSelectedImage(null);
      event.target.value = '';

      setError(
        'Selecione uma imagem JPG, PNG ou WEBP.',
      );

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setSelectedImage(null);
      event.target.value = '';

      setError(
        'A imagem deve ter no máximo 5 MB.',
      );

      return;
    }

    setSelectedImage(file);
  };

  const handleRemoveImage =
    () => {
      setError('');
      setSuccess('');
      setSelectedImage(null);

      setFormData(
        (currentFormData) => ({
          ...currentFormData,
          imageUrl: '',
          imagePublicId: '',
        }),
      );
    };

  const uploadSelectedImage =
    async () => {
      if (!selectedImage) {
        return {
          imageUrl:
            formData.imageUrl.trim() ||
            undefined,
          imagePublicId:
            formData.imagePublicId.trim() ||
            undefined,
        };
      }

      const uploadData =
        new FormData();

      uploadData.append(
        'file',
        selectedImage,
      );

      const response =
        await api.post<ImageUploadResponse>(
          '/produtos/upload-image',
          uploadData,
        );

      return {
        imageUrl:
          response.data.imageUrl,
        imagePublicId:
          response.data
            .imagePublicId,
      };
    };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      const imageData =
        await uploadSelectedImage();

      const payload = {
        name:
          formData.name.trim(),
        description:
          formData.description.trim() ||
          undefined,
        price: Number(
          formData.price,
        ),
        stockQuantity: Number(
          formData.stockQuantity,
        ),
        categoryId: Number(
          formData.categoryId,
        ),
        imageUrl:
          imageData.imageUrl,
        imagePublicId:
          imageData.imagePublicId,
        active:
          formData.active,
      };

      if (
        editingId !== null
      ) {
        await api.put(
          `/produtos/${editingId}`,
          payload,
        );

        setSuccess(
          'Produto atualizado com sucesso.',
        );

        resetForm();

        await fetchProdutos();

        return;
      }

      await api.post(
        '/produtos',
        payload,
      );

      setSuccess(
        'Produto criado com sucesso.',
      );

      resetForm();

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchProdutos();
      }
    } catch (requestError) {
      const axiosError =
        requestError as AxiosError<ApiErrorResponse>;

      console.error(
        'Erro ao salvar produto:',
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
          'Erro ao salvar produto.',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    produto: Produto,
  ) => {
    setError('');
    setSuccess('');
    setEditingId(
      produto.id,
    );
    setSelectedImage(null);

    setFormData({
      name:
        produto.name,
      description:
        produto.description || '',
      price: String(
        produto.price,
      ),
      stockQuantity: String(
        produto.stockQuantity,
      ),
      categoryId: String(
        produto.category?.id ||
          '',
      ),
      imageUrl:
        produto.imageUrl || '',
      imagePublicId:
        produto.imagePublicId ||
        '',
      active:
        produto.active,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleConfirmDelete =
    async () => {
      if (
        deleteId === null
      ) {
        return;
      }

      try {
        setError('');
        setSuccess('');
        setDeleting(true);

        await api.delete(
          `/produtos/${deleteId}`,
        );

        setSuccess(
          'Produto excluído ou desativado com sucesso.',
        );

        setDeleteId(null);

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
      } catch (requestError) {
        const axiosError =
          requestError as AxiosError<ApiErrorResponse>;

        console.error(
          'Erro ao excluir produto:',
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
            'Erro ao excluir produto.',
          ),
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleClearFilters =
    () => {
      setSearch('');
      setCategoryFilter('');
      setActiveFilter('');
      setSort('id,asc');
      setPage(1);
    };

  const hasFilters = Boolean(
    search ||
      categoryFilter ||
      activeFilter ||
      sort !== 'id,asc',
  );

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
            Administração
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
            Produtos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Cadastre, edite e acompanhe os produtos exibidos na loja.
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
              Encontrados
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-2xl font-black text-green-700">
              {
                produtosAtivosNaPagina
              }
            </p>

            <p className="text-xs font-bold text-green-700">
              Ativos na página
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-2xl font-black text-red-700">
              {
                produtosSemEstoqueNaPagina
              }
            </p>

            <p className="text-xs font-bold text-red-700">
              Sem estoque na página
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
              ? 'Editar produto'
              : 'Novo produto'}
          </h3>

          <p className="text-sm text-gray-500">
            Preencha as informações que serão exibidas para os clientes.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="grid gap-4 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-black text-gray-700">
              Nome
            </label>

            <input
              type="text"
              placeholder="Ex: Mel Silvestre"
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

          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Preço
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="89.90"
              value={
                formData.price
              }
              onChange={(
                event,
              ) =>
                setFormData({
                  ...formData,
                  price:
                    event.target
                      .value,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Estoque
            </label>

            <input
              type="number"
              min="0"
              placeholder="10"
              value={
                formData.stockQuantity
              }
              onChange={(
                event,
              ) =>
                setFormData({
                  ...formData,
                  stockQuantity:
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
              Categoria
            </label>

            <select
              value={
                formData.categoryId
              }
              onChange={(
                event,
              ) =>
                setFormData({
                  ...formData,
                  categoryId:
                    event.target
                      .value,
                })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            >
              <option value="">
                Selecione a categoria
              </option>

              {categorias.map(
                (
                  categoria,
                ) => (
                  <option
                    key={
                      categoria.id
                    }
                    value={
                      categoria.id
                    }
                  >
                    {
                      categoria.name
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="produto-image"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Imagem do produto
            </label>

            <input
              id="produto-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleImageChange
              }
              className="block w-full rounded-2xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:font-black file:text-amber-800 hover:file:bg-amber-200"
            />

            <p className="mt-2 text-xs font-medium text-gray-500">
              JPG, PNG ou WEBP.
              Máximo de 5 MB.
            </p>
          </div>

          {(formData.imageUrl ||
            selectedImage) && (
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 sm:flex-row sm:items-center">
                {formData.imageUrl ? (
                  <img
                    src={
                      formData.imageUrl
                    }
                    alt="Imagem atual do produto"
                    className="h-24 w-24 rounded-2xl border border-amber-100 bg-white object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-amber-100 bg-white text-3xl">
                    🖼️
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {selectedImage ? (
                    <>
                      <p className="font-black text-gray-900">
                        Nova imagem selecionada
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-600">
                        {
                          selectedImage.name
                        }
                      </p>

                      {formData.imageUrl && (
                        <p className="mt-2 text-xs font-semibold text-amber-700">
                          Ela substituirá a imagem atual quando o produto for salvo.
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="font-black text-gray-900">
                        Imagem atual
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Esta imagem será mantida se você não selecionar outra.
                      </p>
                    </>
                  )}
                </div>

                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={
                      handleRemoveImage
                    }
                    disabled={
                      saving
                    }
                    className="rounded-xl border border-red-100 bg-white px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remover imagem
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="lg:col-span-4">
            <label className="mb-2 block text-sm font-black text-gray-700">
              Descrição
            </label>

            <textarea
              rows={4}
              placeholder="Descreva o produto..."
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
              className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 lg:col-span-4">
            <input
              id="produto-active"
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
              htmlFor="produto-active"
              className="text-sm font-bold text-gray-700"
            >
              Produto ativo na loja
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-amber-700 px-6 py-3 font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? selectedImage
                  ? 'Enviando e salvando...'
                  : 'Salvando...'
                : editingId !==
                    null
                  ? 'Salvar alterações'
                  : 'Criar produto'}
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
            Buscar produtos
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Pesquise e filtre os produtos cadastrados.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Nome
            </label>

            <input
              type="search"
              placeholder="Buscar produto"
              value={search}
              onChange={(
                event,
              ) => {
                setSearch(
                  event.target
                    .value,
                );
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Categoria
            </label>

            <select
              value={
                categoryFilter
              }
              onChange={(
                event,
              ) => {
                setCategoryFilter(
                  event.target
                    .value,
                );
                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="">
                Todas
              </option>

              {categorias.map(
                (
                  categoria,
                ) => (
                  <option
                    key={
                      categoria.id
                    }
                    value={
                      categoria.id
                    }
                  >
                    {
                      categoria.name
                    }
                  </option>
                ),
              )}
            </select>
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
              ) => {
                setActiveFilter(
                  event.target
                    .value as
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

          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Ordenação
            </label>

            <select
              value={sort}
              onChange={(
                event,
              ) => {
                setSort(
                  event.target
                    .value,
                );

                setPage(1);
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="id,asc">
                ID crescente
              </option>

              <option value="id,desc">
                ID decrescente
              </option>

              <option value="name,asc">
                Nome A-Z
              </option>

              <option value="name,desc">
                Nome Z-A
              </option>

              <option value="price,asc">
                Menor preço
              </option>

              <option value="price,desc">
                Maior preço
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
              Produtos cadastrados
            </h3>

            <p className="text-sm text-gray-500">
              Página{' '}
              {
                pagination.page
              }{' '}
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
              ) => {
                setLimit(
                  Number(
                    event.target
                      .value,
                  ),
                );

                setPage(1);
              }}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold outline-none focus:border-amber-400"
            >
              <option
                value={5}
              >
                5
              </option>

              <option
                value={10}
              >
                10
              </option>

              <option
                value={20}
              >
                20
              </option>

              <option
                value={50}
              >
                50
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

            <p className="mt-4 font-semibold text-gray-600">
              Carregando produtos...
            </p>
          </div>
        ) : produtos.length ===
          0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">
                    Produto
                  </th>

                  <th className="px-6 py-4">
                    Preço
                  </th>

                  <th className="px-6 py-4">
                    Estoque
                  </th>

                  <th className="px-6 py-4">
                    Categoria
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
                {produtos.map(
                  (
                    produto,
                  ) => (
                    <tr
                      key={
                        produto.id
                      }
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-amber-50 text-xl">
                            {produto.imageUrl ? (
                              <img
                                src={
                                  produto.imageUrl
                                }
                                alt={
                                  produto.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              '🍯'
                            )}
                          </div>

                          <div>
                            <p className="font-black text-gray-900">
                              {
                                produto.name
                              }
                            </p>

                            <p className="line-clamp-1 max-w-sm text-sm text-gray-500">
                              {produto.description ||
                                'Sem descrição'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-800">
                        {formatCurrency(
                          produto.price,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            produto.stockQuantity >
                            0
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {
                            produto.stockQuantity
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                        {produto.category
                          ?.name ||
                          'Sem categoria'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            produto.active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {produto.active
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
                                produto,
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
                                produto.id,
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
            {produtos.length} de{' '}
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
        title="Excluir produto?"
        description={`O produto "${
          produtoParaExcluir
            ?.name ||
          'selecionado'
        }" será excluído definitivamente se não possuir histórico de pedidos. Caso possua, será apenas desativado para preservar o histórico.`}
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