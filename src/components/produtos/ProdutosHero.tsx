import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProdutosHeroProps {
  busca: string;
  isLogged: boolean;
  somenteDisponiveis: boolean;
  ordenacao: string;
  onBuscaChange: (value: string) => void;
  onSomenteDisponiveisChange: (value: boolean) => void;
  onOrdenacaoChange: (value: string) => void;
}

const ordenacaoOptions = [
  { value: '', label: 'Padrão' },
  { value: 'price,asc', label: 'Menor preço' },
  { value: 'price,desc', label: 'Maior preço' },
  { value: 'name,asc', label: 'Nome A-Z' },
  { value: 'name,desc', label: 'Nome Z-A' },
];

export function ProdutosHero({
  busca,
  isLogged,
  somenteDisponiveis,
  ordenacao,
  onBuscaChange,
  onSomenteDisponiveisChange,
  onOrdenacaoChange,
}: ProdutosHeroProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedOption =
    ordenacaoOptions.find((option) => option.value === ordenacao) ||
    ordenacaoOptions[0];

  const handleSelectOrdenacao = (value: string) => {
    onOrdenacaoChange(value);
    setDropdownOpen(false);
  };

  const hasFilters = busca || ordenacao || somenteDisponiveis;

  return (
    <section className="relative overflow-visible border-b border-amber-200/60 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 py-24 text-white shadow-xl animate-gradient-shift dark:border-amber-900">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl animate-pulse-gentle" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl animate-pulse-gentle" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl animate-spin-slow" />

      <div className="container relative z-20 mx-auto px-4 text-center">
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
          Produtos naturais selecionados com qualidade, sabor e cuidado.
        </p>

        <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl md:p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              <input
                type="text"
                value={busca}
                onChange={(e) => onBuscaChange(e.target.value)}
                placeholder="Buscar produto..."
                className="h-14 w-full rounded-2xl border border-white/20 bg-white px-12 font-semibold text-gray-900 shadow-lg outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-white/25"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-14 min-w-[165px] items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white px-4 font-black text-gray-800 shadow-lg outline-none transition hover:bg-amber-50 focus:ring-4 focus:ring-white/25"
              >
                <span>{selectedOption.label}</span>

                <span
                  className={`text-xs text-amber-800 transition ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-amber-100 bg-white p-2 text-left shadow-2xl">
                  {ordenacaoOptions.map((option) => {
                    const selected = option.value === ordenacao;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelectOrdenacao(option.value)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                          selected
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900'
                        }`}
                      >
                        <span>{option.label}</span>
                        {selected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSomenteDisponiveisChange(!somenteDisponiveis)}
              className={`h-14 rounded-2xl px-5 font-black shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${
                somenteDisponiveis
                  ? 'bg-amber-950 text-white'
                  : 'border border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/20'
              }`}
            >
              {somenteDisponiveis ? 'Disponíveis ✓' : 'Disponíveis'}
            </button>
          </div>

          {hasFilters && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  onBuscaChange('');
                  onOrdenacaoChange('');
                  onSomenteDisponiveisChange(false);
                  setDropdownOpen(false);
                }}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white transition hover:bg-white/20"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {!isLogged && (
          <div className="mt-8">
            <Link
              to="/cadastro"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-950 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-amber-900 hover:shadow-2xl"
            >
              Criar conta para comprar
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}