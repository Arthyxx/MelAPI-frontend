import { Link } from 'react-router-dom';

interface ProdutoDetalheHeaderProps {
  isLogged: boolean;
  cartItemsCount: number;
}

export function ProdutoDetalheHeader({
  isLogged,
  cartItemsCount,
}: ProdutoDetalheHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-950/90 text-white shadow-xl backdrop-blur-md dark:bg-gray-950/90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/produtos" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-inner">
              <span className="text-3xl">🍯</span>
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight md:text-2xl">
                Apiário Vitória Seven
              </h1>

              <p className="text-xs text-amber-100 md:text-sm">
                Detalhes do produto
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
            >
              <span>←</span>
              Produtos
            </Link>

            {isLogged ? (
              <Link
                to="/carrinho"
                className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
              >
                <span>🛒</span>
                Carrinho

                {cartItemsCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
              >
                <span>🔐</span>
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}