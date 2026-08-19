import {
  statusPedidoOptions,
} from '../../../constants/statusPedido';

interface PedidosFiltersProps {
  search: string;
  statusFilter: string;
  hasFilters: boolean;
  onSearchChange: (
    value: string,
  ) => void;
  onStatusFilterChange: (
    value: string,
  ) => void;
  onClearFilters: () => void;
}

export function PedidosFilters({
  search,
  statusFilter,
  hasFilters,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
}: PedidosFiltersProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-xl font-black text-gray-950">
          Buscar pedidos
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Pesquise pelo número do pedido,
          nome ou e-mail do cliente.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr_auto]">
        <div>
          <label
            htmlFor="pedidos-search"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Busca
          </label>

          <input
            id="pedidos-search"
            type="search"
            placeholder="Pedido, cliente ou e-mail"
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
            htmlFor="pedidos-status-filter"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Status
          </label>

          <select
            id="pedidos-status-filter"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target.value,
              )
            }
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          >
            <option value="">
              Todos
            </option>

            {statusPedidoOptions.map(
              (statusOption) => (
                <option
                  key={
                    statusOption.value
                  }
                  value={
                    statusOption.value
                  }
                >
                  {
                    statusOption.label
                  }
                </option>
              ),
            )}
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