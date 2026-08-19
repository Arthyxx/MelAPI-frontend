import {
  Link,
} from 'react-router-dom';

import type {
  Categoria,
} from '../../types/categoria';

const ordenacoes = [
  {
    label: 'Padrão',
    value: '',
  },
  {
    label: 'Menor preço',
    value: 'price,asc',
  },
  {
    label: 'Maior preço',
    value: 'price,desc',
  },
  {
    label: 'Nome A-Z',
    value: 'name,asc',
  },
];

interface CategoriaProdutosHeroProps {
  categoria: Categoria | null;
  busca: string;
  ordenacao: string;
  somenteDisponiveis: boolean;
  hasFilters: boolean;

  onBuscaChange: (
    value: string,
  ) => void;

  onOrdenacaoChange: (
    value: string,
  ) => void;

  onToggleDisponiveis: () => void;
  onClearFilters: () => void;
}

export function CategoriaProdutosHero({
  categoria,
  busca,
  ordenacao,
  somenteDisponiveis,
  hasFilters,
  onBuscaChange,
  onOrdenacaoChange,
  onToggleDisponiveis,
  onClearFilters,
}: CategoriaProdutosHeroProps) {
  return (
    <section className="rounded-[2rem] border border-amber-200 bg-white/90 p-6 text-center shadow-sm backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/produtos"
          className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-800 transition hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300"
        >
          ← Todos os produtos
        </Link>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-amber-700 dark:text-amber-300">
          Categoria
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-amber-950 dark:text-amber-300 md:text-5xl">
          {categoria?.name ||
            'Categoria'}
        </h1>

        {categoria?.description && (
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {categoria.description}
          </p>
        )}

        <div className="mx-auto mt-7 max-w-2xl">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔎
            </span>

            <input
              type="text"
              value={busca}
              onChange={(event) =>
                onBuscaChange(
                  event.target.value,
                )
              }
              placeholder="Buscar nesta categoria..."
              className="h-14 w-full rounded-2xl border border-amber-200 bg-white px-12 text-center font-semibold text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 dark:border-amber-800 dark:bg-gray-950 dark:text-white dark:focus:ring-amber-900"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {ordenacoes.map(
            (item) => {
              const selected =
                ordenacao ===
                item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onOrdenacaoChange(
                      item.value,
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    selected
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            },
          )}

          <button
            type="button"
            onClick={
              onToggleDisponiveis
            }
            className={`rounded-full px-4 py-2 text-sm font-black transition ${
              somenteDisponiveis
                ? 'bg-amber-950 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300'
            }`}
          >
            Disponíveis
            {somenteDisponiveis &&
              ' ✓'}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={
                onClearFilters
              }
              className="rounded-full px-4 py-2 text-sm font-black text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </section>
  );
}