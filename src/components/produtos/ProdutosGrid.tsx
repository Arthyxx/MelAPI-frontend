import { ProdutoCard } from './ProdutoCard';
import { ProdutosEmptyState } from './ProdutosEmptyState';
import type { Produto } from '../../types/produto';

interface ProdutosGridProps {
  produtos: Produto[];
  isLogged: boolean;
  onAddToCart: (produto: Produto) => void;
  onClearSearch: () => void;
}

export function ProdutosGrid({
  produtos,
  isLogged,
  onAddToCart,
  onClearSearch,
}: ProdutosGridProps) {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800">
            Produtos em destaque
          </span>

          <h3 className="mt-3 text-3xl font-black text-amber-950 dark:text-amber-300">
            Nossa seleção
          </h3>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {produtos.length}{' '}
            {produtos.length === 1
              ? 'produto encontrado'
              : 'produtos encontrados'}
          </p>
        </div>

        {!isLogged && (
          <div className="rounded-2xl border border-amber-200 bg-white/80 px-5 py-4 text-sm text-amber-900 shadow-sm backdrop-blur-md dark:border-amber-800 dark:bg-gray-900/80 dark:text-amber-200">
            <strong>Quer comprar?</strong> Entre ou cadastre-se para adicionar
            produtos ao carrinho.
          </div>
        )}
      </div>

      {produtos.length === 0 ? (
        <ProdutosEmptyState onClearSearch={onClearSearch} />
      ) : (
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {produtos.map((produto, index) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              index={index}
              isLogged={isLogged}
              onAddToCart={onAddToCart}
            />
          ))}
        </section>
      )}
    </main>
  );
}