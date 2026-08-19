import { PedidosFilters } from './pedidos/PedidosFilters';
import { PedidosPagination } from './pedidos/PedidosPagination';
import { PedidosSummary } from './pedidos/PedidosSummary';
import { PedidosTable } from './pedidos/PedidosTable';
import { usePedidoStatus } from './pedidos/usePedidoStatus';
import { usePedidosList } from './pedidos/usePedidosList';

export function PedidosAdmin() {
  const pedidosList =
    usePedidosList();

  const pedidoStatus =
    usePedidoStatus({
      onUpdated:
        pedidosList.fetchPedidos,
    });

  const error =
    pedidoStatus.error ||
    pedidosList.error;

  const success =
    pedidoStatus.success;

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <PedidosSummary
        totalItems={
          pedidosList.pagination
            .totalItems
        }
        pedidosPendentesNaPagina={
          pedidosList
            .pedidosPendentesNaPagina
        }
        pedidosEntreguesNaPagina={
          pedidosList
            .pedidosEntreguesNaPagina
        }
        faturamentoNaPagina={
          pedidosList
            .faturamentoNaPagina
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700"
        >
          {success}
        </div>
      )}

      <PedidosFilters
        search={
          pedidosList.search
        }
        statusFilter={
          pedidosList.statusFilter
        }
        hasFilters={
          pedidosList.hasFilters
        }
        onSearchChange={
          pedidosList.handleSearchChange
        }
        onStatusFilterChange={
          pedidosList
            .handleStatusFilterChange
        }
        onClearFilters={
          pedidosList.handleClearFilters
        }
      />

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <PedidosPagination
          pagination={
            pedidosList.pagination
          }
          pedidosCount={
            pedidosList.pedidos.length
          }
          limit={
            pedidosList.limit
          }
          loading={
            pedidosList.loading
          }
          onLimitChange={
            pedidosList.handleLimitChange
          }
          onPreviousPage={
            pedidosList
              .handlePreviousPage
          }
          onNextPage={
            pedidosList
              .handleNextPage
          }
        >
          <PedidosTable
            pedidos={
              pedidosList.pedidos
            }
            loading={
              pedidosList.loading
            }
            updatingId={
              pedidoStatus.updatingId
            }
            onUpdateStatus={
              pedidoStatus.updateStatus
            }
          />
        </PedidosPagination>
      </section>
    </div>
  );
}