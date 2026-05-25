import { Link } from 'react-router-dom';
import type { Produto } from '../../../types/produto';
import { formatCurrency } from '../../../utils/formatCurrency';

interface ProdutoDetalheMainProps {
  produto: Produto;
  isLogged: boolean;
  onAddToCart: () => void;
}

export function ProdutoDetalheMain({
  produto,
  isLogged,
  onAddToCart,
}: ProdutoDetalheMainProps) {
  const semEstoque = produto.stockQuantity <= 0;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-950 dark:via-gray-900 dark:to-gray-950">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl animate-pulse-gentle" />
          <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl animate-pulse-gentle" />

          {produto.imageUrl ? (
            <img
              src={produto.imageUrl}
              alt={produto.name}
              className="relative z-10 h-full w-full object-cover"
            />
          ) : (
            <div className="relative z-10 text-center">
              <div className="text-9xl drop-shadow-2xl animate-bounce-soft">
                🍯
              </div>

              <p className="mt-4 rounded-full bg-white/70 px-5 py-2 text-sm font-black text-amber-900 shadow-md backdrop-blur-md">
                Produto artesanal
              </p>
            </div>
          )}

          {semEstoque && (
            <span className="absolute right-5 top-5 z-20 rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white shadow-lg">
              Sem estoque
            </span>
          )}
        </div>

        <div className="p-6 sm:p-10">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-amber-800">
            Produto natural
          </span>

          <h2 className="mt-5 text-4xl font-black leading-tight text-amber-950 dark:text-amber-300 md:text-5xl">
            {produto.name}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {produto.description ||
              'Produto artesanal selecionado do Apiário Vitória Seven. Ideal para quem busca qualidade, sabor e produtos naturais direto do produtor.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              🐝 Natural
            </span>

            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
              🍯 Artesanal
            </span>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
              📦 Estoque: {produto.stockQuantity}
            </span>
          </div>

          <div className="mt-8 rounded-3xl border border-amber-100 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Preço
            </p>

            <p className="mt-1 text-5xl font-black text-amber-700 dark:text-amber-300">
              {formatCurrency(produto.price)}
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Valor sem taxa de entrega. Entrega a combinar com o vendedor.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onAddToCart}
              disabled={semEstoque}
              className={`group relative overflow-hidden rounded-2xl px-6 py-4 font-black shadow-xl transition duration-300 ${
                semEstoque
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  : isLogged
                    ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white hover:-translate-y-1 hover:shadow-2xl'
                    : 'bg-gradient-to-r from-amber-950 to-amber-800 text-white hover:-translate-y-1 hover:shadow-2xl'
              }`}
            >
              {!semEstoque && (
                <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />
              )}

              <span className="relative flex items-center justify-center gap-2">
                {semEstoque ? (
                  <>
                    <span>🚫</span>
                    Indisponível
                  </>
                ) : isLogged ? (
                  <>
                    <span>🛒</span>
                    Adicionar ao carrinho
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    Entrar para comprar
                  </>
                )}
              </span>
            </button>

            <Link
              to="/produtos"
              className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-6 py-4 font-black text-amber-800 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
            >
              Ver outros produtos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}