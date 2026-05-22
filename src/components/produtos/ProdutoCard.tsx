import { Link } from 'react-router-dom';
import type { Produto } from '../../types/produto';
import { formatCurrency } from '../../utils/formatCurrency';

interface ProdutoCardProps {
  produto: Produto;
  index: number;
  isLogged: boolean;
  onAddToCart: (produto: Produto) => void;
}

export function ProdutoCard({
  produto,
  index,
  isLogged,
  onAddToCart,
}: ProdutoCardProps) {
  const semEstoque = produto.stockQuantity <= 0;

  return (
    <article
      className="group animate-fade-in-up overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-amber-800 dark:bg-gray-900"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-950 dark:via-gray-800 dark:to-gray-900">
        {produto.imageUrl ? (
          <img
            src={produto.imageUrl}
            alt={produto.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="relative">
            <span className="text-8xl drop-shadow-md transition duration-500 group-hover:scale-110">
              🍯
            </span>
            <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-2xl animate-pulse-gentle" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-amber-900 shadow-md backdrop-blur-md">
          Artesanal
        </span>

        {semEstoque && (
          <span className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white shadow-md">
            Sem estoque
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-xl font-black text-amber-950 dark:text-amber-300">
            {produto.name}
          </h4>

          <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {produto.description ||
              'Produto artesanal selecionado do Apiário Vitória Seven.'}
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            🐝 Natural
          </span>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            Estoque: {produto.stockQuantity}
          </span>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Preço
            </p>

            <p className="text-3xl font-black text-amber-700 dark:text-amber-300">
              {formatCurrency(produto.price)}
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right dark:bg-amber-950/40">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
              Qualidade
            </p>

            <p className="text-sm font-black text-amber-950 dark:text-amber-200">
              Premium
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <Link
            to={`/produtos/${produto.id}`}
            className="group/details inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-white px-5 py-4 font-black text-amber-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
          >
            Ver detalhes
            <span className="transition group-hover/details:translate-x-1">
              →
            </span>
          </Link>

          <button
            type="button"
            onClick={() => onAddToCart(produto)}
            disabled={semEstoque}
            className={`group/btn relative w-full overflow-hidden rounded-2xl px-5 py-4 font-black shadow-lg transition duration-300 ${
              semEstoque
                ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                : isLogged
                  ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white hover:-translate-y-1 hover:shadow-2xl'
                  : 'bg-gradient-to-r from-amber-950 to-amber-800 text-white hover:-translate-y-1 hover:shadow-2xl'
            }`}
          >
            {!semEstoque && (
              <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover/btn:translate-x-[100%]" />
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
        </div>
      </div>
    </article>
  );
}