import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  category: { id: number; name: string };
}

interface Categoria {
  id: number;
  name: string;
}

const initialFormData = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  categoryId: '',
  imageUrl: '',
  active: true,
};

export function ProdutosAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState(initialFormData);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const produtoParaExcluir = produtos.find((produto) => produto.id === deleteId);

  const produtosAtivos = useMemo(() => {
    return produtos.filter((produto) => produto.active).length;
  }, [produtos]);

  const produtosSemEstoque = useMemo(() => {
    return produtos.filter((produto) => produto.stockQuantity <= 0).length;
  }, [produtos]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  const fetchProdutos = async () => {
    const response = await api.get('/produtos');
    const content = response.data.content || response.data;

    setProdutos(Array.isArray(content) ? content : []);
  };

  const fetchCategorias = async () => {
    const response = await api.get('/categorias');
    const content = response.data.content || response.data;

    setCategorias(Array.isArray(content) ? content : []);
  };

  const fetchData = async () => {
    try {
      setError('');
      setLoading(true);

      await Promise.all([fetchProdutos(), fetchCategorias()]);
    } catch (err) {
      console.error('Erro ao carregar dados do admin de produtos:', err);
      setError('Erro ao carregar produtos e categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        categoryId: Number(formData.categoryId),
        imageUrl: formData.imageUrl.trim() || undefined,
        active: formData.active,
      };

      if (editingId) {
        await api.put(`/produtos/${editingId}`, payload);
        setSuccess('Produto atualizado com sucesso.');
      } else {
        await api.post('/produtos', payload);
        setSuccess('Produto criado com sucesso.');
      }

      resetForm();
      await fetchProdutos();
    } catch (err: any) {
      console.error('Erro ao salvar produto:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao salvar produto.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (produto: Produto) => {
    setError('');
    setSuccess('');
    setEditingId(produto.id);

    setFormData({
      name: produto.name,
      description: produto.description || '',
      price: String(produto.price),
      stockQuantity: String(produto.stockQuantity),
      categoryId: String(produto.category?.id || ''),
      imageUrl: produto.imageUrl || '',
      active: produto.active,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setError('');
      setSuccess('');

      await api.delete(`/produtos/${deleteId}`);

      setSuccess('Produto excluído com sucesso.');
      setDeleteId(null);

      await fetchProdutos();
    } catch (err: any) {
      console.error('Erro ao excluir produto:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao excluir produto.'
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando produtos...
        </p>
      </div>
    );
  }

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
              {produtos.length}
            </p>
            <p className="text-xs font-bold text-gray-500">Total</p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-2xl font-black text-green-700">
              {produtosAtivos}
            </p>
            <p className="text-xs font-bold text-green-700">Ativos</p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-2xl font-black text-red-700">
              {produtosSemEstoque}
            </p>
            <p className="text-xs font-bold text-red-700">Sem estoque</p>
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
            {editingId ? 'Editar produto' : 'Novo produto'}
          </h3>

          <p className="text-sm text-gray-500">
            Preencha as informações que serão exibidas para os clientes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-black text-gray-700">
              Nome
            </label>

            <input
              type="text"
              placeholder="Ex: Mel Silvestre"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
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
              value={formData.price}
              onChange={(event) =>
                setFormData({ ...formData, price: event.target.value })
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
              value={formData.stockQuantity}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  stockQuantity: event.target.value,
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
              value={formData.categoryId}
              onChange={(event) =>
                setFormData({ ...formData, categoryId: event.target.value })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            >
              <option value="">Selecione a categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-black text-gray-700">
              URL da imagem
            </label>

            <input
              type="text"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(event) =>
                setFormData({ ...formData, imageUrl: event.target.value })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="lg:col-span-4">
            <label className="mb-2 block text-sm font-black text-gray-700">
              Descrição
            </label>

            <textarea
              rows={4}
              placeholder="Descreva o produto..."
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 lg:col-span-4">
            <input
              id="produto-active"
              type="checkbox"
              checked={formData.active}
              onChange={(event) =>
                setFormData({ ...formData, active: event.target.checked })
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
                ? 'Salvando...'
                : editingId
                  ? 'Salvar alterações'
                  : 'Criar produto'}
            </button>

            {editingId && (
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

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-950">
              Produtos cadastrados
            </h3>

            <p className="text-sm text-gray-500">
              Gerencie os produtos já disponíveis no sistema.
            </p>
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhum produto cadastrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {produtos.map((produto) => (
                  <tr
                    key={produto.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                          {produto.imageUrl ? (
                            <img
                              src={produto.imageUrl}
                              alt={produto.name}
                              className="h-full w-full rounded-2xl object-cover"
                            />
                          ) : (
                            '🍯'
                          )}
                        </div>

                        <div>
                          <p className="font-black text-gray-900">
                            {produto.name}
                          </p>

                          <p className="line-clamp-1 max-w-sm text-sm text-gray-500">
                            {produto.description || 'Sem descrição'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-800">
                      {formatCurrency(produto.price)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          produto.stockQuantity > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {produto.stockQuantity}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                      {produto.category?.name || 'Sem categoria'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          produto.active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {produto.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(produto)}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(produto.id)}
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
      </section>

      <ConfirmModal
        open={!!deleteId}
        title="Excluir produto?"
        description={`O produto "${
          produtoParaExcluir?.name || 'selecionado'
        }" será removido do sistema. Essa ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}