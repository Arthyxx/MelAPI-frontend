export function ProdutosBenefits() {
  return (
    <section className="border-b border-amber-200/60 bg-white/70 py-8 backdrop-blur-md dark:border-amber-900 dark:bg-gray-950/70">
      <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
        <div className="animate-fade-in-up rounded-3xl border border-amber-200 bg-white p-5 shadow-md dark:border-amber-800 dark:bg-gray-900">
          <div className="text-3xl">🐝</div>

          <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
            Direto do apiário
          </h3>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Produtos selecionados com foco em qualidade e origem.
          </p>
        </div>

        <div className="animate-fade-in-up delay-100 rounded-3xl border border-amber-200 bg-white p-5 shadow-md dark:border-amber-800 dark:bg-gray-900">
          <div className="text-3xl">📦</div>

          <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
            Pedido acompanhado
          </h3>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Cliente acompanha status e detalhes dos pedidos.
          </p>
        </div>

        <div className="animate-fade-in-up delay-200 rounded-3xl border border-amber-200 bg-white p-5 shadow-md dark:border-amber-800 dark:bg-gray-900">
          <div className="text-3xl">🍯</div>

          <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
            Compra simples
          </h3>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Vitrine pública, carrinho e finalização para clientes logados.
          </p>
        </div>
      </div>
    </section>
  );
}