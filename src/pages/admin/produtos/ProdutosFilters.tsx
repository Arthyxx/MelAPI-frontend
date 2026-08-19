import type {
  ActiveFilter,
  Categoria,
} from './produto.types';

interface ProdutosFiltersProps {
  search: string;
  categoryFilter: string;
  activeFilter: ActiveFilter;
  sort: string;
  categorias: Categoria[];
  hasFilters: boolean;
  onSearchChange: (
    value: string,
  ) => void;
  onCategoryFilterChange: (
    value: string,
  ) => void;
  onActiveFilterChange: (
    value: ActiveFilter,
  ) => void;
  onSortChange: (
    value: string,
  ) => void;
  onClearFilters: () => void;
}

export function ProdutosFilters({
  search,
  categoryFilter,
  activeFilter,
  sort,
  categorias,
  hasFilters,
  onSearchChange,
  onCategoryFilterChange,
  onActiveFilterChange,
  onSortChange,
  onClearFilters,
}: ProdutosFiltersProps) {
  return (
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
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-black text-gray-700">
            Categoria
          </label>

          <select
            value={categoryFilter}
            onChange={(event) =>
              onCategoryFilterChange(
                event.target.value,
              )
            }
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          >
            <option value="">
              Todas
            </option>

            {categorias.map(
              (categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.name}
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

        <div>
          <label className="mb-2 block text-sm font-black text-gray-700">
            Ordenação
          </label>

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(
                event.target.value,
              )
            }
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