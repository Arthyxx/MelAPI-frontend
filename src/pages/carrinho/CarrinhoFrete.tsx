import {
  formatCurrency,
} from '../../utils/formatCurrency';

import type {
  FreteOption,
} from './useFrete';

interface CarrinhoFreteProps {
  zipCode: string;
  options: FreteOption[];
  selectedOption: FreteOption | null;
  loading: boolean;
  error: string;

  onZipCodeChange: (
    value: string,
  ) => void;

  onCalculate: () => void;

  onSelectOption: (
    option: FreteOption,
  ) => void;
}

export function CarrinhoFrete({
  zipCode,
  options,
  selectedOption,
  loading,
  error,
  onZipCodeChange,
  onCalculate,
  onSelectOption,
}: CarrinhoFreteProps) {
  return (
    <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
      <div>
        <p className="font-black text-amber-950 dark:text-amber-300">
          Calcular frete
        </p>

        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Informe o CEP de entrega para
          consultar as opções disponíveis.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={9}
          value={zipCode}
          placeholder="00000-000"
          aria-label="CEP de entrega"
          onChange={(event) =>
            onZipCodeChange(
              event.target.value,
            )
          }
          className="h-12 min-w-0 flex-1 rounded-2xl border border-amber-200 bg-white px-4 font-bold text-gray-900 outline-none transition placeholder:font-medium placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:border-amber-800 dark:bg-gray-900 dark:text-white dark:focus:ring-amber-950"
        />

        <button
          type="button"
          onClick={onCalculate}
          disabled={loading}
          className="h-12 rounded-2xl bg-amber-700 px-5 font-black text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Calculando...'
            : 'Calcular'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {options.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Opções de entrega
          </p>

          {options.map(
            (option) => {
              const selected =
                selectedOption
                  ?.serviceId ===
                option.serviceId;

              return (
                <button
                  key={
                    option.serviceId
                  }
                  type="button"
                  onClick={() =>
                    onSelectOption(
                      option,
                    )
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected
                      ? 'border-amber-500 bg-white shadow-md ring-2 ring-amber-200 dark:bg-gray-900 dark:ring-amber-900'
                      : 'border-amber-100 bg-white/70 hover:border-amber-300 hover:bg-white dark:border-amber-900 dark:bg-gray-900/70 dark:hover:border-amber-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {option.companyPicture ? (
                      <img
                        src={
                          option.companyPicture
                        }
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-xl bg-white object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl dark:bg-amber-950">
                        🚚
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-black text-gray-900 dark:text-white">
                            {
                              option.serviceName
                            }
                          </p>

                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {
                              option.companyName
                            }
                          </p>
                        </div>

                        <p className="font-black text-amber-700 dark:text-amber-300">
                          {formatCurrency(
                            option.price,
                          )}
                        </p>
                      </div>

                      <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Prazo estimado:{' '}
                        {
                          option.deliveryTime
                        }{' '}
                        {option.deliveryTime ===
                        1
                          ? 'dia útil'
                          : 'dias úteis'}
                      </p>

                      {selected && (
                        <p className="mt-2 text-xs font-black text-green-700 dark:text-green-400">
                          ✓ Frete selecionado
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}