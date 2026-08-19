import { Link } from 'react-router-dom';

export function DashboardHero() {
  return (
    <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-yellow-50 to-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
            Resumo da loja
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
            Acompanhe o que está acontecendo
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            Veja pedidos, estoque,
            clientes e faturamento
            em um único lugar.
          </p>
        </div>

        <Link
          to="/produtos"
          className="inline-flex items-center justify-center rounded-2xl bg-amber-700 px-5 py-3 text-sm font-black text-white transition hover:bg-amber-800"
        >
          🛍️ Abrir loja
        </Link>
      </div>
    </section>
  );
}