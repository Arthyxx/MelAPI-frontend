import type {
  ActiveFilter,
  ClienteRole,
} from './cliente.types';

interface ClientesFiltersProps {
  search: string;
  roleFilter: ClienteRole | '';
  activeFilter: ActiveFilter;
  hasFilters: boolean;
  onSearchChange: (
    value: string,
  ) => void;
  onRoleFilterChange: (
    value: ClienteRole | '',
  ) => void;
  onActiveFilterChange: (
    value: ActiveFilter,
  ) => void;
  onClearFilters: () => void;
}

export function ClientesFilters({
  search,
  roleFilter,
  activeFilter,
  hasFilters,
  onSearchChange,
  onRoleFilterChange,
  onActiveFilterChange,
  onClearFilters,
}: ClientesFiltersProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-xl font-black text-gray-950">
          Buscar clientes
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Pesquise por nome, e-mail,
          telefone ou cidade.
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
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
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
            onChange={(event) =>
              onRoleFilterChange(
                event.target
                  .value as
                  | ClienteRole
                  | '',
              )
            }
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
            onChange={(event) =>
              onActiveFilterChange(
                event.target
                  .value as ActiveFilter,
              )
            }
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
            onClick={
              onClearFilters
            }
            disabled={
              !hasFilters
            }
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-5 font-black text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </section>
  );
}