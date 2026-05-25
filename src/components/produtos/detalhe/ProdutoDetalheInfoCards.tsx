export function ProdutoDetalheInfoCards() {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-amber-200 bg-white/85 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-800 dark:bg-gray-900/85">
        <div className="text-3xl">🐝</div>

        <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
          Origem natural
        </h3>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Produto selecionado com foco em qualidade e procedência.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-white/85 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-800 dark:bg-gray-900/85">
        <div className="text-3xl">📦</div>

        <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
          Entrega a combinar
        </h3>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          O vendedor pode confirmar valor e forma de entrega após o pedido.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-white/85 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-amber-800 dark:bg-gray-900/85">
        <div className="text-3xl">⭐</div>

        <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
          Avaliações reais
        </h3>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Veja opiniões de clientes sobre este produto.
        </p>
      </div>
    </section>
  );
}