import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { api } from '../../services/api';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

interface Categoria {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

const initialFormData = {
  name: '',
  description: '',
  active: true,
};

export function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState(initialFormData);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categoriaParaExcluir = categorias.find(
    (categoria) => categoria.id === deleteId
  );

  const categoriasAtivas = useMemo(() => {
    return categorias.filter((categoria) => categoria.active).length;
  }, [categorias]);

  const categoriasInativas = useMemo(() => {
    return categorias.filter((categoria) => !categoria.active).length;
  }, [categorias]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  const fetchCategorias = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await api.get('/categorias/admin');
      const content = response.data.content || response.data;

      setCategorias(Array.isArray(content) ? content : []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        active: formData.active,
      };

      if (editingId) {
        await api.put(`/categorias/${editingId}`, payload);
        setSuccess('Categoria atualizada com sucesso.');
      } else {
        await api.post('/categorias', payload);
        setSuccess('Categoria criada com sucesso.');
      }

      resetForm();
      await fetchCategorias();
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao salvar categoria.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setError('');
    setSuccess('');
    setEditingId(categoria.id);

    setFormData({
      name: categoria.name,
      description: categoria.description || '',
      active: categoria.active,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setError('');
      setSuccess('');

      await api.delete(`/categorias/${deleteId}`);

      setSuccess('Categoria excluída com sucesso.');
      setDeleteId(null);

      await fetchCategorias();
    } catch (err: any) {
      console.error('Erro ao excluir categoria:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao excluir categoria.'
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando categorias...
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
            Categorias
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Organize os tipos de produtos exibidos na loja.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-950">
              {categorias.length}
            </p>
            <p className="text-xs font-bold text-gray-500">Total</p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
            <p className="text-2xl font-black text-green-700">
              {categoriasAtivas}
            </p>
            <p className="text-xs font-bold text-green-700">Ativas</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-600">
              {categoriasInativas}
            </p>
            <p className="text-xs font-bold text-gray-500">Inativas</p>
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
            {editingId ? 'Editar categoria' : 'Nova categoria'}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Use categorias para organizar a vitrine e facilitar a navegação dos
            clientes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-black text-gray-700">
              Nome
            </label>

            <input
              type="text"
              placeholder="Ex: Mel Puro"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
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
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 lg:col-span-4">
            <input
              id="categoria-active"
              type="checkbox"
              checked={formData.active}
              onChange={(event) =>
                setFormData({ ...formData, active: event.target.checked })
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
                : editingId
                  ? 'Salvar alterações'
                  : 'Criar categoria'}
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
              Categorias cadastradas
            </h3>

            <p className="text-sm text-gray-500">
              Lista de categorias disponíveis para organização dos produtos.
            </p>
          </div>
        </div>

        {categorias.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {categorias.map((categoria) => (
                  <tr
                    key={categoria.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                          🏷️
                        </div>

                        <div>
                          <p className="font-black text-gray-900">
                            {categoria.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            ID #{categoria.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {categoria.description || 'Sem descrição'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          categoria.active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {categoria.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(categoria)}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(categoria.id)}
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
        title="Excluir categoria?"
        description={`A categoria "${
          categoriaParaExcluir?.name || 'selecionada'
        }" será removida do sistema. Essa ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}