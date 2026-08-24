import type {
  ProdutoFormData,
} from './produto.types';

interface ProdutoShippingFieldsProps {
  formData: ProdutoFormData;
  onFieldChange: (
    field: keyof ProdutoFormData,
    value: string | boolean,
  ) => void;
}

export function ProdutoShippingFields({
  formData,
  onFieldChange,
}: ProdutoShippingFieldsProps) {
  return (
    <div className="lg:col-span-4">
      <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
        <div className="mb-4">
          <h4 className="font-black text-gray-900">
            Peso e dimensões para frete
          </h4>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Essas informações serão usadas para calcular o frete do produto.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="produto-weight"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Peso (kg)
            </label>

            <input
              id="produto-weight"
              type="number"
              min="0.001"
              step="0.001"
              placeholder="0.500"
              value={
                formData.weightKg
              }
              onChange={(event) =>
                onFieldChange(
                  'weightKg',
                  event.target.value,
                )
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />

            <p className="mt-1 text-xs font-medium text-gray-500">
              Ex.: 0,500 kg = 500 g
            </p>
          </div>

          <div>
            <label
              htmlFor="produto-height"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Altura (cm)
            </label>

            <input
              id="produto-height"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="12"
              value={
                formData.heightCm
              }
              onChange={(event) =>
                onFieldChange(
                  'heightCm',
                  event.target.value,
                )
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="produto-width"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Largura (cm)
            </label>

            <input
              id="produto-width"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="10"
              value={
                formData.widthCm
              }
              onChange={(event) =>
                onFieldChange(
                  'widthCm',
                  event.target.value,
                )
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="produto-length"
              className="mb-2 block text-sm font-black text-gray-700"
            >
              Comprimento (cm)
            </label>

            <input
              id="produto-length"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="18"
              value={
                formData.lengthCm
              }
              onChange={(event) =>
                onFieldChange(
                  'lengthCm',
                  event.target.value,
                )
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold text-amber-800">
          Para o cálculo de frete funcionar, o produto deverá possuir peso,
          altura, largura e comprimento preenchidos.
        </p>
      </div>
    </div>
  );
}