interface ProdutosEmptyStateProps {
  onClearSearch: () => void;
}

export function ProdutosEmptyState({ onClearSearch }: ProdutosEmptyStateProps) {
  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-10 text-center shadow-2xl dark:border-amber-800 dark:bg-gray-900">
      <div className="mb-4 text-7xl">🍯</div>

      <h3 className="text-2xl font-black text-amber-900 dark:text-amber-300">
        Nenhum produto encontrado
      </h3>

      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Tente buscar por outro nome ou limpe o campo de pesquisa.
      </p>

      <button
        type="button"
        onClick={onClearSearch}
        className="mt-6 rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
      >
        Limpar busca
      </button>
    </section>
  );
}