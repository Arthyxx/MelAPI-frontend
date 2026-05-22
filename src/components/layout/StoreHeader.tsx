import { Link } from 'react-router-dom';

interface StoreHeaderProps {
  isLogged: boolean;
  cartItemsCount: number;
  onOpenMenu: () => void;
}

export function StoreHeader({
  isLogged,
  cartItemsCount,
  onOpenMenu,
}: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-950/90 text-white shadow-xl backdrop-blur-md dark:bg-gray-950/90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/produtos" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-inner animate-bounce-soft">
              <span className="text-3xl">🍯</span>
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight md:text-2xl">
                Apiário Vitória Seven
              </h1>

              <p className="text-xs text-amber-100 md:text-sm">
                Mel puro, própolis e produtos naturais
              </p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            {!isLogged ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
                >
                  <span>🔐</span>
                  Entrar
                </Link>

                <Link
                  to="/cadastro"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
                >
                  <span>✨</span>
                  Cadastrar
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenMenu}
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-xl"
                aria-label="Abrir menu"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-6 rounded-full bg-white" />
                  <span className="block h-0.5 w-6 rounded-full bg-white" />
                  <span className="block h-0.5 w-6 rounded-full bg-white" />
                </span>

                {cartItemsCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}