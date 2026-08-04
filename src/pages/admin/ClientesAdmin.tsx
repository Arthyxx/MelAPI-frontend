import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

interface Cliente {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialFormData = {
  name: '',
  email: '',
  password: '',
  role: 'CLIENTE',
};

export function ClientesAdmin() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState(initialFormData);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clienteParaExcluir = clientes.find((cliente) => cliente.id === deleteId);

  const totalAdmins = useMemo(() => {
    return clientes.filter((cliente) => cliente.role === 'ADMIN').length;
  }, [clientes]);

  const totalClientes = useMemo(() => {
    return clientes.filter((cliente) => cliente.role !== 'ADMIN').length;
  }, [clientes]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  const fetchClientes = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await api.get('/clientes');
      const data = Array.isArray(response.data) ? response.data : [];

      setClientes(data);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      if (editingId) {
        await api.put(`/clientes/${editingId}`, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
        });

        setSuccess('Cliente atualizado com sucesso.');
      } else {
        await api.post('/clientes/admin', {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        });

        setSuccess('Cliente criado com sucesso.');
      }

      resetForm();
      await fetchClientes();
    } catch (err: any) {
      console.error('Erro ao salvar cliente:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao salvar cliente.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setError('');
    setSuccess('');
    setEditingId(cliente.id);

    setFormData({
      name: cliente.name,
      email: cliente.email,
      password: '',
      role: cliente.role,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setError('');
      setSuccess('');

      await api.delete(`/clientes/${deleteId}`);

      setSuccess('Cliente excluído com sucesso.');
      setDeleteId(null);

      await fetchClientes();
    } catch (err: any) {
      console.error('Erro ao excluir cliente:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao excluir cliente.'
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-gray-600">
          Carregando clientes...
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
            Clientes
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Gerencie contas de clientes e administradores.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-2xl font-black text-gray-950">
              {clientes.length}
            </p>
            <p className="text-xs font-bold text-gray-500">Total</p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-2xl font-black text-blue-700">
              {totalClientes}
            </p>
            <p className="text-xs font-bold text-blue-700">Clientes</p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">
            <p className="text-2xl font-black text-purple-700">
              {totalAdmins}
            </p>
            <p className="text-xs font-bold text-purple-700">Admins</p>
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
            {editingId ? 'Editar cliente' : 'Novo cliente'}
          </h3>

          <p className="text-sm text-gray-500">
            Controle dados básicos e nível de acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Nome
            </label>

            <input
              type="text"
              placeholder="Nome completo"
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
              E-mail
            </label>

            <input
              type="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              required
            />
          </div>

          {!editingId && (
            <div>
              <label className="mb-2 block text-sm font-black text-gray-700">
                Senha
              </label>

              <input
                type="password"
                placeholder="Senha inicial"
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-black text-gray-700">
              Perfil
            </label>

            <select
              value={formData.role}
              onChange={(event) =>
                setFormData({ ...formData, role: event.target.value })
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            >
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
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
                  : 'Criar cliente'}
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
              Clientes cadastrados
            </h3>

            <p className="text-sm text-gray-500">
              Lista de usuários registrados no sistema.
            </p>
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Nenhum cliente cadastrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Perfil</th>
                  <th className="px-6 py-4 text-right">Ações</th>
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
                            .map((part) => part[0])
                            .join('')
                            .toUpperCase() || 'CL'}
                        </div>

                        <div>
                          <p className="font-black text-gray-900">
                            {cliente.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            ID #{cliente.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                      {cliente.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          cliente.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {cliente.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(cliente)}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(cliente.id)}
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
        title="Excluir cliente?"
        description={`O cliente "${
          clienteParaExcluir?.name || 'selecionado'
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