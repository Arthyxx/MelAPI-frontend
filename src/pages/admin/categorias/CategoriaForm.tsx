import type { FormEvent } from 'react';

import type {
  CategoriaFormData,
} from './categoria.types';

interface CategoriaFormProps {
  editingId: number | null;
  formData: CategoriaFormData;
  saving: boolean;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  onFieldChange: (
    field: keyof CategoriaFormData,
    value: string | boolean,
  ) => void;
  onCancelEdit: () => void;
}

export function CategoriaForm({
  editingId,
  formData,
  saving,
  onSubmit,
  onFieldChange,
  onCancelEdit,
}: CategoriaFormProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-black text-gray-950">
          {editingId !== null
            ? 'Editar categoria'
            : 'Nova categoria'}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Use categorias para organizar
          a vitrine e facilitar a
          navegação dos clientes.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 lg:grid-cols-4"
      >
        <div className="lg:col-span-2">
          <label
            htmlFor="categoria-name"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Nome
          </label>

          <input
            id="categoria-name"
            type="text"
            placeholder="Ex: Mel Puro"
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

        <div className="lg:col-span-2">
          <label
            htmlFor="categoria-description"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Descrição
          </label>

          <input
            id="categoria-description"
            type="text"
            placeholder="Descrição breve da categoria"
            value={
              formData.description
            }
            onChange={(event) =>
              onFieldChange(
                'description',
                event.target.value,
              )
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
            onChange={(event) =>
              onFieldChange(
                'active',
                event.target.checked,
              )
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
              : editingId !== null
                ? 'Salvar alterações'
                : 'Criar categoria'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={
                onCancelEdit
              }
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