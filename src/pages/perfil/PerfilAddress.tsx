import {
  perfilInputClass,
  perfilLabelClass,
} from './perfil.constants';

import type {
  PerfilFormData,
} from './perfil.types';

interface PerfilAddressProps {
  formData: PerfilFormData;
  loadingCep: boolean;
  cepError: string;
  cepMessage: string;
  onLookupCep: () => Promise<void>;
  onChange: (
    field: keyof PerfilFormData,
    value: string,
  ) => void;
}

export function PerfilAddress({
  formData,
  loadingCep,
  cepError,
  cepMessage,
  onLookupCep,
  onChange,
}: PerfilAddressProps) {
  return (
    <section className="animate-fade-in-up delay-100">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
          📍
        </div>

        <div>
          <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
            Endereço de entrega
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usado para facilitar a entrega dos pedidos.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="perfil-cep"
          className={perfilLabelClass}
        >
          CEP
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <input
            id="perfil-cep"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Digite os 8 números"
            maxLength={9}
            value={formData.zipCode}
            aria-invalid={Boolean(cepError)}
            aria-describedby="perfil-cep-feedback"
            onChange={(event) =>
              onChange('zipCode', event.target.value)
            }
            className={`${perfilInputClass} min-w-0 sm:flex-1`}
          />

          <button
            type="button"
            onClick={() => void onLookupCep()}
            disabled={loadingCep}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 disabled:cursor-wait disabled:opacity-60"
          >
            {loadingCep && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
              />
            )}

            {loadingCep ? 'Buscando…' : 'Buscar CEP'}
          </button>
        </div>

        <div
          id="perfil-cep-feedback"
          aria-live="polite"
          aria-atomic="true"
          className="mt-2 space-y-1 text-sm"
        >
          {loadingCep && (
            <p className="text-amber-800 dark:text-amber-300">
              Consultando o endereço…
            </p>
          )}

          {cepError && (
            <p className="text-red-600 dark:text-red-400">
              {cepError}
            </p>
          )}

          {cepMessage && (
            <p className="text-gray-600 dark:text-gray-300">
              {cepMessage}
            </p>
          )}

          {!loadingCep && !cepError && !cepMessage && (
            <p className="text-gray-500 dark:text-gray-400">
              Busque o CEP para preencher o endereço. Ao alterar o
              CEP, os campos do endereço anterior serão limpos.
            </p>
          )}
        </div>
      </div>

      <fieldset
        disabled={loadingCep}
        className="grid min-w-0 grid-cols-1 gap-4 disabled:opacity-60 md:grid-cols-2"
      >
        <legend className="sr-only">Dados do endereço</legend>

        <div>
          <label
            htmlFor="perfil-state"
            className={perfilLabelClass}
          >
            Estado
          </label>

          <input
            id="perfil-state"
            type="text"
            autoComplete="address-level1"
            placeholder="CE"
            maxLength={2}
            value={formData.state}
            onChange={(event) =>
              onChange('state', event.target.value)
            }
            className={perfilInputClass}
          />
        </div>

        <div>
          <label
            htmlFor="perfil-city"
            className={perfilLabelClass}
          >
            Cidade
          </label>

          <input
            id="perfil-city"
            type="text"
            autoComplete="address-level2"
            placeholder="Fortaleza"
            value={formData.city}
            onChange={(event) =>
              onChange('city', event.target.value)
            }
            className={perfilInputClass}
          />
        </div>

        <div>
          <label
            htmlFor="perfil-neighborhood"
            className={perfilLabelClass}
          >
            Bairro
          </label>

          <input
            id="perfil-neighborhood"
            type="text"
            placeholder="Centro"
            value={formData.neighborhood}
            onChange={(event) =>
              onChange('neighborhood', event.target.value)
            }
            className={perfilInputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="perfil-street"
            className={perfilLabelClass}
          >
            Rua
          </label>

          <input
            id="perfil-street"
            type="text"
            autoComplete="address-line1"
            placeholder="Rua das Flores"
            value={formData.street}
            onChange={(event) =>
              onChange('street', event.target.value)
            }
            className={perfilInputClass}
          />
        </div>

        <div>
          <label
            htmlFor="perfil-address-number"
            className={perfilLabelClass}
          >
            Número
          </label>

          <input
            id="perfil-address-number"
            type="text"
            placeholder="123"
            value={formData.addressNumber}
            onChange={(event) =>
              onChange('addressNumber', event.target.value)
            }
            className={perfilInputClass}
          />
        </div>

        <div>
          <label
            htmlFor="perfil-complement"
            className={perfilLabelClass}
          >
            Complemento
          </label>

          <input
            id="perfil-complement"
            type="text"
            autoComplete="address-line2"
            placeholder="Apartamento, bloco, referência..."
            value={formData.complement}
            onChange={(event) =>
              onChange('complement', event.target.value)
            }
            className={perfilInputClass}
          />
        </div>
      </fieldset>
    </section>
  );
}