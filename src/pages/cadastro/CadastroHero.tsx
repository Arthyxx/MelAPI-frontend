export function CadastroHero() {
  return (
    <section className="hidden animate-fade-in-up lg:block">
      <div className="rounded-[2rem] border border-amber-200 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-amber-900 dark:bg-gray-900/60">
        <div className="mb-8 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
          🍯 Apiário Vitória Seven
        </div>

        <h1 className="text-5xl font-black leading-tight text-amber-950 dark:text-amber-300">
          Crie sua conta e compre
          produtos naturais com
          facilidade.
        </h1>

        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">
          Cadastre seus dados para
          acompanhar pedidos,
          finalizar compras e
          receber atualizações
          sobre seus produtos.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-3xl border border-amber-100 bg-white/80 p-5 shadow-md dark:border-amber-900 dark:bg-gray-950/70">
            <div className="text-3xl">
              📦
            </div>

            <h3 className="mt-3 font-extrabold text-amber-900 dark:text-amber-300">
              Acompanhe seus pedidos
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Veja status, detalhes
              e histórico de
              compras.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white/80 p-5 shadow-md dark:border-amber-900 dark:bg-gray-950/70">
            <div className="text-3xl">
              🐝
            </div>

            <h3 className="mt-3 font-extrabold text-amber-900 dark:text-amber-300">
              Produtos artesanais
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Mel, própolis e
              produtos naturais em
              uma experiência
              simples.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}