import { Link } from 'react-router-dom';
import type { Categoria } from '../../types/categoria';

interface CategoriasShowcaseProps {
  categorias: Categoria[];
}

export function CategoriasShowcase({ categorias }: CategoriasShowcaseProps) {
  const categoriasAtivas = categorias.filter((categoria) => categoria.active !== false);

  if (categoriasAtivas.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 pt-10">
      <div className="rounded-[2rem] border border-amber-200 bg-white/85 p-5 shadow-sm backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/85">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800">
              Categorias
            </span>

            <h3 className="mt-3 text-2xl font-black text-amber-950 dark:text-amber-300">
              Explore por tipo de produto
            </h3>
          </div>

          <Link
            to="/produtos"
            className="w-fit rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
          >
            Todos os produtos
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {categoriasAtivas.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/categorias/${categoria.id}`}
              className="group min-w-fit rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-lg dark:border-amber-900 dark:bg-amber-950/30 dark:hover:bg-gray-950"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm transition group-hover:scale-105 dark:bg-gray-950">
                  🍯
                </div>

                <div className="text-left">
                  <p className="font-black text-amber-950 dark:text-amber-300">
                    {categoria.name}
                  </p>

                  {categoria.description && (
                    <p className="mt-0.5 max-w-48 truncate text-xs text-gray-500 dark:text-gray-400">
                      {categoria.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}