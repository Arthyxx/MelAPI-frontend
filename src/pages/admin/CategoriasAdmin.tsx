import { ConfirmModal } from '../../components/ui/ConfirmModal';

import { CategoriaForm } from './categorias/CategoriaForm';
import { CategoriasFilters } from './categorias/CategoriasFilters';
import { CategoriasPagination } from './categorias/CategoriasPagination';
import { CategoriasSummary } from './categorias/CategoriasSummary';
import { CategoriasTable } from './categorias/CategoriasTable';
import { useCategoriaDelete } from './categorias/useCategoriaDelete';
import { useCategoriaForm } from './categorias/useCategoriaForm';
import { useCategoriasList } from './categorias/useCategoriasList';

export function CategoriasAdmin() {
  const categoriasList =
    useCategoriasList();

  const categoriaForm =
    useCategoriaForm({
      onCreated:
        categoriasList.refreshAfterCreate,
      onUpdated:
        categoriasList.refreshAfterUpdate,
    });

  const categoriaDelete =
    useCategoriaDelete({
      categorias:
        categoriasList.categorias,
      onDeleted:
        categoriasList.refreshAfterDelete,
    });

  const error =
    categoriaForm.error ||
    categoriaDelete.error ||
    categoriasList.error;

  const success =
    categoriaForm.success ||
    categoriaDelete.success;

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <CategoriasSummary
        totalItems={
          categoriasList.pagination
            .totalItems
        }
        categoriasAtivasNaPagina={
          categoriasList
            .categoriasAtivasNaPagina
        }
        categoriasInativasNaPagina={
          categoriasList
            .categoriasInativasNaPagina
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

      <CategoriaForm
        editingId={
          categoriaForm.editingId
        }
        formData={
          categoriaForm.formData
        }
        saving={
          categoriaForm.saving
        }
        onSubmit={
          categoriaForm.handleSubmit
        }
        onFieldChange={
          categoriaForm.handleFieldChange
        }
        onCancelEdit={
          categoriaForm.handleCancelEdit
        }
      />

      <CategoriasFilters
        search={
          categoriasList.search
        }
        activeFilter={
          categoriasList.activeFilter
        }
        hasFilters={
          categoriasList.hasFilters
        }
        onSearchChange={
          categoriasList.handleSearchChange
        }
        onActiveFilterChange={
          categoriasList
            .handleActiveFilterChange
        }
        onClearFilters={
          categoriasList.handleClearFilters
        }
      />

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <CategoriasPagination
          pagination={
            categoriasList.pagination
          }
          categoriasCount={
            categoriasList.categorias.length
          }
          limit={
            categoriasList.limit
          }
          loading={
            categoriasList.loading
          }
          onLimitChange={
            categoriasList.handleLimitChange
          }
          onPreviousPage={
            categoriasList
              .handlePreviousPage
          }
          onNextPage={
            categoriasList
              .handleNextPage
          }
        >
          <CategoriasTable
            categorias={
              categoriasList.categorias
            }
            loading={
              categoriasList.loading
            }
            onEdit={
              categoriaForm.handleEdit
            }
            onDelete={
              categoriaDelete.handleDelete
            }
          />
        </CategoriasPagination>
      </section>

      <ConfirmModal
        open={
          categoriaDelete.deleteId !==
          null
        }
        title="Excluir categoria?"
        description={`A categoria "${
          categoriaDelete
            .categoriaParaExcluir
            ?.name ||
          'selecionada'
        }" será excluída definitivamente se não possuir produtos vinculados. Caso possua produtos, a categoria e os produtos ativos vinculados serão desativados para preservar o histórico.`}
        confirmText={
          categoriaDelete.deleting
            ? 'Processando...'
            : 'Confirmar'
        }
        cancelText="Cancelar"
        variant="danger"
        onConfirm={
          categoriaDelete
            .handleConfirmDelete
        }
        onCancel={
          categoriaDelete
            .handleCancelDelete
        }
      />
    </div>
  );
}