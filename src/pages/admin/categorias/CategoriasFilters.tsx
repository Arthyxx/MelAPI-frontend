import type {
  ActiveFilter,
} from './categoria.types';

interface CategoriasFiltersProps {
  search: string;
  activeFilter: ActiveFilter;
  hasFilters: boolean;
  onSearchChange: (
    value: string,
  ) => void;
  onActiveFilterChange: (
    value: ActiveFilter,
  ) => void;
  onClearFilters: () => void;
}

export function CategoriasFilters({
  search,
  activeFilter,
  hasFilters,
  onSearchChange,
  onActiveFilterChange,
  onClearFilters,
}: CategoriasFiltersProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-xl font-black text-gray-950">
          Buscar categorias
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Pesquise pelo nome ou descrição
          e filtre pelo status.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div>
          <label
            htmlFor="categorias-search"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Busca
          </label>

          <input
            id="categorias-search"
            type="search"
            placeholder="Nome ou descrição"
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
            htmlFor="categorias-active-filter"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Status
          </label>

          <select
            id="categorias-active-filter"
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
              onClearFilters
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
  );
}