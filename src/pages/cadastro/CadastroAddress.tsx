import {
  cadastroInputClass,
  cadastroLabelClass,
} from './cadastro.constants';

import type {
  CadastroFormData,
} from './cadastro.types';

interface CadastroAddressProps {
  formData: CadastroFormData;
  loadingCep: boolean;
  cepError: string;
  cepMessage: string;
  onChange: (
    field: keyof CadastroFormData,
    value: string,
  ) => void;
  onLookupCep: () => void;
}

export function CadastroAddress({
  formData,
  loadingCep,
  cepError,
  cepMessage,
  onChange,
  onLookupCep,
}: CadastroAddressProps) {
  return (
    <section className="animate-fade-in-up delay-200">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
          🏠
        </div>

        <div>
          <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
            Endereço de entrega
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usado para facilitar a
            entrega dos produtos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            CEP
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="60000000"
              value={formData.zipCode}
              onChange={(event) =>
                onChange(
                  'zipCode',
                  event.target.value,
                )
              }
              className={`${cadastroInputClass} min-w-0 flex-1`}
              required
            />

            <button
              type="button"
              onClick={onLookupCep}
              disabled={loadingCep}
              className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              {loadingCep
                ? 'Buscando...'
                : 'Buscar CEP'}
            </button>
          </div>

          {cepError && (
            <p
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {cepError}
            </p>
          )}

          {cepMessage && (
            <p
              className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"
              aria-live="polite"
            >
              {cepMessage}
            </p>
          )}
        </div>

        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            Estado
          </label>

          <input
            type="text"
            autoComplete="address-level1"
            placeholder="CE"
            value={formData.state}
            onChange={(event) =>
              onChange(
                'state',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            disabled={loadingCep}
            required
          />
        </div>

        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            Cidade
          </label>

          <input
            type="text"
            autoComplete="address-level2"
            placeholder="Fortaleza"
            value={formData.city}
            onChange={(event) =>
              onChange(
                'city',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            disabled={loadingCep}
            required
          />
        </div>

        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            Bairro
          </label>

          <input
            type="text"
            placeholder="Centro"
            value={
              formData.neighborhood
            }
            onChange={(event) =>
              onChange(
                'neighborhood',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            disabled={loadingCep}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            className={
              cadastroLabelClass
            }
          >
            Rua
          </label>

          <input
            type="text"
            autoComplete="street-address"
            placeholder="Rua das Flores"
            value={formData.street}
            onChange={(event) =>
              onChange(
                'street',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            disabled={loadingCep}
            required
          />
        </div>

        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            Número
          </label>

          <input
            type="text"
            placeholder="123"
            value={
              formData.addressNumber
            }
            onChange={(event) =>
              onChange(
                'addressNumber',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            disabled={loadingCep}
            required
          />
        </div>

        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            Complemento
          </label>

          <input
            type="text"
            placeholder="Apartamento, bloco, referência..."
            value={
              formData.complement
            }
            onChange={(event) =>
              onChange(
                'complement',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            disabled={loadingCep}
          />
        </div>
      </div>
    </section>
  );
}
