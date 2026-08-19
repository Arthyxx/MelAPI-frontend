import {
  Link,
} from 'react-router-dom';

export function CarrinhoHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-950/90 text-white shadow-xl backdrop-blur-md dark:bg-gray-950/90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link
            to="/produtos"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-inner">
              <span className="text-3xl">
                🛒
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Meu Carrinho
              </h1>

              <p className="text-sm text-amber-100">
                Revise seus produtos
                antes de finalizar o
                pedido
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/meus-pedidos"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
            >
              <span>📦</span>
              Meus pedidos
            </Link>

            <Link
              to="/produtos"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
            >
              <span>←</span>
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}