import type { FormEvent } from 'react';

import type {
  ClienteFormData,
  ClienteRole,
} from './cliente.types';

interface ClienteFormProps {
  editingId: number | null;
  formData: ClienteFormData;
  saving: boolean;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  onFieldChange: (
    field: keyof ClienteFormData,
    value: string | boolean,
  ) => void;
  onCancelEdit: () => void;
}

export function ClienteForm({
  editingId,
  formData,
  saving,
  onSubmit,
  onFieldChange,
  onCancelEdit,
}: ClienteFormProps) {
  return (
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
        onSubmit={onSubmit}
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
              onFieldChange(
                'name',
                event.target.value,
              )
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
              onFieldChange(
                'email',
                event.target.value,
              )
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
              onFieldChange(
                'password',
                event.target.value,
              )
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
              onFieldChange(
                'role',
                event.target
                  .value as ClienteRole,
              )
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
              onFieldChange(
                'active',
                event.target.checked,
              )
            }
            className="h-4 w-4 accent-amber-700"
          />

          <label
            htmlFor="cliente-active"
            className="text-sm font-bold text-gray-700"
          >
            Conta ativa e autorizada a entrar
            no sistema
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
              onClick={onCancelEdit}
              disabled={saving}
              className="rounded-2xl border border-gray-200 bg-white px-6 py-3 font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>
    </section>
  );
}