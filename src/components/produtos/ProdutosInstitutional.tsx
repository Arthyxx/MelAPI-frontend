export function ProdutosInstitutional() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-950 py-16 text-white">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl animate-pulse-gentle" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl animate-pulse-gentle" />

      <div className="container relative z-10 mx-auto grid gap-8 px-4 lg:grid-cols-[1fr_0.75fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-50">
            Produtos naturais
          </span>

          <h3 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            Uma loja digital para valorizar o mel artesanal.
          </h3>

          <p className="mt-4 max-w-2xl text-amber-100">
            O Apiário Vitória Seven reúne produtos naturais com uma experiência
            simples, bonita e confiável para clientes comprarem e acompanharem
            seus pedidos.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
          <div className="text-6xl">🍯</div>

          <h4 className="mt-4 text-2xl font-black">
            Mel com identidade profissional
          </h4>

          <p className="mt-2 text-sm text-amber-100">
            Vitrine moderna, carrinho, pedidos e painel administrativo para
            gerenciar a loja.
          </p>
        </div>
      </div>
    </section>
  );
}