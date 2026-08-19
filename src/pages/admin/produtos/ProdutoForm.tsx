import type {
  ChangeEvent,
  FormEvent,
} from 'react';

import type {
  Categoria,
  ProdutoFormData,
} from './produto.types';

interface ProdutoFormProps {
  editingId: number | null;
  formData: ProdutoFormData;
  categorias: Categoria[];
  selectedImage: File | null;
  saving: boolean;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
  onFieldChange: (
    field: keyof ProdutoFormData,
    value: string | boolean,
  ) => void;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveImage: () => void;
  onCancelEdit: () => void;
}

export function ProdutoForm({
  editingId,
  formData,
  categorias,
  selectedImage,
  saving,
  onSubmit,
  onFieldChange,
  onImageChange,
  onRemoveImage,
  onCancelEdit,
}: ProdutoFormProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-1">
        <h3 className="text-xl font-black text-gray-950">
          {editingId !== null
            ? 'Editar produto'
            : 'Novo produto'}
        </h3>

        <p className="text-sm text-gray-500">
          Preencha as informações que
          serão exibidas para os clientes.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 lg:grid-cols-4"
      >
        <div className="lg:col-span-2">
          <label
            htmlFor="produto-name"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Nome
          </label>

          <input
            id="produto-name"
            type="text"
            placeholder="Ex: Mel Silvestre"
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
            htmlFor="produto-price"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Preço
          </label>

          <input
            id="produto-price"
            type="number"
            step="0.01"
            min="0"
            placeholder="89.90"
            value={formData.price}
            onChange={(event) =>
              onFieldChange(
                'price',
                event.target.value,
              )
            }
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="produto-stock"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Estoque
          </label>

          <input
            id="produto-stock"
            type="number"
            min="0"
            placeholder="10"
            value={
              formData.stockQuantity
            }
            onChange={(event) =>
              onFieldChange(
                'stockQuantity',
                event.target.value,
              )
            }
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="produto-category"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Categoria
          </label>

          <select
            id="produto-category"
            value={
              formData.categoryId
            }
            onChange={(event) =>
              onFieldChange(
                'categoryId',
                event.target.value,
              )
            }
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            required
          >
            <option value="">
              Selecione a categoria
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

        <div className="lg:col-span-2">
          <label
            htmlFor="produto-image"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Imagem do produto
          </label>

          <input
            id="produto-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onImageChange}
            className="block w-full rounded-2xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:font-black file:text-amber-800 hover:file:bg-amber-200"
          />

          <p className="mt-2 text-xs font-medium text-gray-500">
            JPG, PNG ou WEBP. Máximo
            de 5 MB.
          </p>
        </div>

        {(formData.imageUrl ||
          selectedImage) && (
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 sm:flex-row sm:items-center">
              {formData.imageUrl ? (
                <img
                  src={
                    formData.imageUrl
                  }
                  alt="Imagem atual do produto"
                  className="h-24 w-24 rounded-2xl border border-amber-100 bg-white object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-amber-100 bg-white text-3xl">
                  🖼️
                </div>
              )}

              <div className="min-w-0 flex-1">
                {selectedImage ? (
                  <>
                    <p className="font-black text-gray-900">
                      Nova imagem
                      selecionada
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-gray-600">
                      {
                        selectedImage.name
                      }
                    </p>

                    {formData.imageUrl && (
                      <p className="mt-2 text-xs font-semibold text-amber-700">
                        Ela substituirá
                        a imagem atual
                        quando o produto
                        for salvo.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-black text-gray-900">
                      Imagem atual
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Esta imagem será
                      mantida se você
                      não selecionar
                      outra.
                    </p>
                  </>
                )}
              </div>

              {(formData.imageUrl ||
                selectedImage) && (
                <button
                  type="button"
                  onClick={
                    onRemoveImage
                  }
                  disabled={saving}
                  className="rounded-xl border border-red-100 bg-white px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remover imagem
                </button>
              )}
            </div>
          </div>
        )}

        <div className="lg:col-span-4">
          <label
            htmlFor="produto-description"
            className="mb-2 block text-sm font-black text-gray-700"
          >
            Descrição
          </label>

          <textarea
            id="produto-description"
            rows={4}
            placeholder="Descreva o produto..."
            value={
              formData.description
            }
            onChange={(event) =>
              onFieldChange(
                'description',
                event.target.value,
              )
            }
            className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 lg:col-span-4">
          <input
            id="produto-active"
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
            htmlFor="produto-active"
            className="text-sm font-bold text-gray-700"
          >
            Produto ativo na loja
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-amber-700 px-6 py-3 font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? selectedImage
                ? 'Enviando e salvando...'
                : 'Salvando...'
              : editingId !== null
                ? 'Salvar alterações'
                : 'Criar produto'}
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