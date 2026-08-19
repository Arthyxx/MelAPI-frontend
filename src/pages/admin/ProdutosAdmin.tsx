import { ConfirmModal } from '../../components/ui/ConfirmModal';

import { ProdutoForm } from './produtos/ProdutoForm';
import { ProdutosFilters } from './produtos/ProdutosFilters';
import { ProdutosPagination } from './produtos/ProdutosPagination';
import { ProdutosSummary } from './produtos/ProdutosSummary';
import { ProdutosTable } from './produtos/ProdutosTable';
import { useProdutoDelete } from './produtos/useProdutoDelete';
import { useProdutoForm } from './produtos/useProdutoForm';
import { useProdutosList } from './produtos/useProdutosList';

export function ProdutosAdmin() {
  const produtosList =
    useProdutosList();

  const produtoForm =
    useProdutoForm({
      onCreated:
        produtosList.refreshAfterCreate,
      onUpdated:
        produtosList.refreshAfterUpdate,
    });

  const produtoDelete =
    useProdutoDelete({
      produtos:
        produtosList.produtos,
      onDeleted:
        produtosList.refreshAfterDelete,
    });

  const error =
    produtoForm.error ||
    produtoDelete.error ||
    produtosList.error;

  const success =
    produtoForm.success ||
    produtoDelete.success;

  return (
    <div className="space-y-6 bg-white text-gray-900">
      <ProdutosSummary
        totalItems={
          produtosList.pagination
            .totalItems
        }
        produtosAtivosNaPagina={
          produtosList
            .produtosAtivosNaPagina
        }
        produtosSemEstoqueNaPagina={
          produtosList
            .produtosSemEstoqueNaPagina
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

      <ProdutoForm
        editingId={
          produtoForm.editingId
        }
        formData={
          produtoForm.formData
        }
        categorias={
          produtosList.categorias
        }
        selectedImage={
          produtoForm.selectedImage
        }
        saving={
          produtoForm.saving
        }
        onSubmit={
          produtoForm.handleSubmit
        }
        onFieldChange={
          produtoForm.handleFieldChange
        }
        onImageChange={
          produtoForm.handleImageChange
        }
        onRemoveImage={
          produtoForm.handleRemoveImage
        }
        onCancelEdit={
          produtoForm.handleCancelEdit
        }
      />

      <ProdutosFilters
        search={
          produtosList.search
        }
        categoryFilter={
          produtosList.categoryFilter
        }
        activeFilter={
          produtosList.activeFilter
        }
        sort={
          produtosList.sort
        }
        categorias={
          produtosList.categorias
        }
        hasFilters={
          produtosList.hasFilters
        }
        onSearchChange={
          produtosList.handleSearchChange
        }
        onCategoryFilterChange={
          produtosList
            .handleCategoryFilterChange
        }
        onActiveFilterChange={
          produtosList
            .handleActiveFilterChange
        }
        onSortChange={
          produtosList.handleSortChange
        }
        onClearFilters={
          produtosList.handleClearFilters
        }
      />

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <ProdutosPagination
          pagination={
            produtosList.pagination
          }
          produtosCount={
            produtosList.produtos.length
          }
          limit={
            produtosList.limit
          }
          loading={
            produtosList.loading
          }
          onLimitChange={
            produtosList.handleLimitChange
          }
          onPreviousPage={
            produtosList.handlePreviousPage
          }
          onNextPage={
            produtosList.handleNextPage
          }
        >
          <ProdutosTable
            produtos={
              produtosList.produtos
            }
            loading={
              produtosList.loading
            }
            onEdit={
              produtoForm.handleEdit
            }
            onDelete={
              produtoDelete.handleDelete
            }
          />
        </ProdutosPagination>
      </section>

      <ConfirmModal
        open={
          produtoDelete.deleteId !==
          null
        }
        title="Excluir produto?"
        description={`O produto "${
          produtoDelete
            .produtoParaExcluir
            ?.name ||
          'selecionado'
        }" será excluído definitivamente se não possuir histórico de pedidos. Caso possua, será apenas desativado para preservar o histórico.`}
        confirmText={
          produtoDelete.deleting
            ? 'Processando...'
            : 'Confirmar'
        }
        cancelText="Cancelar"
        variant="danger"
        onConfirm={
          produtoDelete
            .handleConfirmDelete
        }
        onCancel={
          produtoDelete
            .handleCancelDelete
        }
      />
    </div>
  );
}