export function CadastroHeader() {
  return (
    <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-8 text-white sm:px-10">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-4xl shadow-inner">
          🍯
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-amber-100">
            Criar conta
          </p>

          <h2 className="text-3xl font-black">
            Cadastro de cliente
          </h2>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-sm text-amber-50">
        Preencha seus dados para comprar
        e acompanhar seus pedidos. Sim,
        o formulário é grande, porque
        entrega precisa de endereço,
        essa pequena exigência da
        realidade física.
      </p>
    </div>
  );
}