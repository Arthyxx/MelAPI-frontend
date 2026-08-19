import { ConfirmModal } from '../../components/ui/ConfirmModal';

import { ClienteForm } from './clientes/ClienteForm';
import { ClientesFilters } from './clientes/ClientesFilters';
import { ClientesPagination } from './clientes/ClientesPagination';
import { ClientesSummary } from './clientes/ClientesSummary';
import { ClientesTable } from './clientes/ClientesTable';
import { useClienteDelete } from './clientes/useClienteDelete';
import { useClienteForm } from './clientes/useClienteForm';
import { useClientesList } from './clientes/useClientesList';

export function ClientesAdmin() {
  const clientesList =
    useClientesList();

  const clienteForm =
    useClienteForm({
      onSaved:
        clientesList.refreshAfterSave,
    });

  const clienteDelete =
    useClienteDelete({
      clientes:
        clientesList.clientes,
      onDeleted:
        clientesList.refreshAfterDelete,
    });

  const error =
    clienteForm.error ||
    clienteDelete.error ||
    clientesList.error;

  const success =
    clienteForm.success ||
    clienteDelete.success;

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <ClientesSummary
        totalItems={
          clientesList.pagination
            .totalItems
        }
        totalClientesNaPagina={
          clientesList
            .totalClientesNaPagina
        }
        totalAdminsNaPagina={
          clientesList
            .totalAdminsNaPagina
        }
        totalAtivosNaPagina={
          clientesList
            .totalAtivosNaPagina
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

      <ClienteForm
        editingId={
          clienteForm.editingId
        }
        formData={
          clienteForm.formData
        }
        saving={
          clienteForm.saving
        }
        onSubmit={
          clienteForm.handleSubmit
        }
        onFieldChange={
          clienteForm.handleFieldChange
        }
        onCancelEdit={
          clienteForm.handleCancelEdit
        }
      />

      <ClientesFilters
        search={
          clientesList.search
        }
        roleFilter={
          clientesList.roleFilter
        }
        activeFilter={
          clientesList.activeFilter
        }
        hasFilters={
          clientesList.hasFilters
        }
        onSearchChange={
          clientesList.handleSearchChange
        }
        onRoleFilterChange={
          clientesList
            .handleRoleFilterChange
        }
        onActiveFilterChange={
          clientesList
            .handleActiveFilterChange
        }
        onClearFilters={
          clientesList.handleClearFilters
        }
      />

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <ClientesPagination
          pagination={
            clientesList.pagination
          }
          clientesCount={
            clientesList.clientes.length
          }
          limit={
            clientesList.limit
          }
          loading={
            clientesList.loading
          }
          onLimitChange={
            clientesList.handleLimitChange
          }
          onPreviousPage={
            clientesList
              .handlePreviousPage
          }
          onNextPage={
            clientesList
              .handleNextPage
          }
        >
          <ClientesTable
            clientes={
              clientesList.clientes
            }
            loading={
              clientesList.loading
            }
            onEdit={
              clienteForm.handleEdit
            }
            onDelete={
              clienteDelete.handleDelete
            }
          />
        </ClientesPagination>
      </section>

      <ConfirmModal
        open={
          clienteDelete.deleteId !==
          null
        }
        title="Excluir ou desativar cliente?"
        description={`O cliente "${
          clienteDelete
            .clienteParaExcluir
            ?.name ||
          'selecionado'
        }" será excluído definitivamente quando não possuir histórico. Caso tenha pedidos, a conta será desativada e os registros serão preservados.`}
        confirmText={
          clienteDelete.deleting
            ? 'Processando...'
            : 'Confirmar'
        }
        cancelText="Cancelar"
        variant="danger"
        onConfirm={
          clienteDelete
            .handleConfirmDelete
        }
        onCancel={
          clienteDelete
            .handleCancelDelete
        }
      />
    </div>
  );
}