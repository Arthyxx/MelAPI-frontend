import { Link } from 'react-router-dom';
import type { Categoria } from '../../types/categoria';

interface StoreHeaderProps {
  isLogged: boolean;
  cartItemsCount: number;
  categorias?: Categoria[];
  onOpenMenu: () => void;
}

export function StoreHeader({
  isLogged,
  cartItemsCount,
  categorias = [],
  onOpenMenu,
}: StoreHeaderProps) {
  const categoriasAtivas = categorias.filter(
    (categoria) => categoria.active !== false
  );

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/70 bg-white/90 shadow-sm backdrop-blur-xl dark:border-amber-900 dark:bg-gray-950/90">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/produtos" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-3xl shadow-inner">
              🍯
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight text-amber-950 dark:text-amber-300 sm:text-xl">
                Apiário Vitória Seven
              </h1>

              <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                Produtos naturais
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {!isLogged && (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="rounded-2xl border border-amber-200 bg-white px-4 py-2 text-sm font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
                >
                  Entrar
                </Link>

                <Link
                  to="/cadastro"
                  className="rounded-2xl bg-amber-700 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800 hover:shadow-md"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {isLogged && (
              <button
                type="button"
                onClick={onOpenMenu}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white text-2xl font-black text-amber-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
                aria-label="Abrir menu"
              >
                ☰

                {cartItemsCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {categoriasAtivas.length > 0 && (
          <nav className="flex items-center gap-2 overflow-x-auto border-t border-amber-100 py-3 dark:border-amber-900">
            <Link
              to="/produtos"
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-black text-amber-800 transition hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40"
            >
              Todos
            </Link>

            {categoriasAtivas.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/categorias/${categoria.id}`}
                className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-amber-50 hover:text-amber-800 dark:text-gray-300 dark:hover:bg-amber-950/40 dark:hover:text-amber-300"
              >
                {categoria.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}