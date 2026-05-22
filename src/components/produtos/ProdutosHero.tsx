import { Link } from 'react-router-dom';

interface ProdutosHeroProps {
  busca: string;
  isLogged: boolean;
  onBuscaChange: (value: string) => void;
}

export function ProdutosHero({
  busca,
  isLogged,
  onBuscaChange,
}: ProdutosHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-amber-200/60 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 py-24 text-white shadow-xl animate-gradient-shift dark:border-amber-900">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl animate-pulse-gentle" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl animate-pulse-gentle" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl animate-spin-slow" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/15 text-6xl shadow-inner backdrop-blur-md">
          🍯
        </div>

        <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-50 shadow-sm backdrop-blur-md">
          Loja oficial do apiário
        </span>

        <h2 className="mx-auto mt-5 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
          Mel puro e produtos naturais direto do produtor
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base text-amber-50 md:text-lg">
          Uma loja feita para vender produtos de mel com apresentação
          profissional, vitrine pública e compra segura para clientes
          cadastrados.
        </p>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔎
            </span>

            <input
              type="text"
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              placeholder="Buscar mel, própolis, geleia real..."
              className="w-full rounded-2xl border border-white/20 bg-white/95 px-12 py-4 font-medium text-gray-900 shadow-xl outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-white/30"
            />
          </div>

          {!isLogged && (
            <Link
              to="/cadastro"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-950 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-amber-900 hover:shadow-2xl"
            >
              Criar conta
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}