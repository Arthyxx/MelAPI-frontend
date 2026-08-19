import {
  Stars,
} from './Stars';

interface AvaliacoesHeaderProps {
  media: number;
  totalAvaliacoes: number;
}

export function AvaliacoesHeader({
  media,
  totalAvaliacoes,
}: AvaliacoesHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-7 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-amber-100">
            Avaliações
          </p>

          <h3 className="mt-1 text-3xl font-black">
            Opiniões dos clientes
          </h3>

          <p className="mt-2 text-sm text-amber-50">
            Veja avaliações reais de
            clientes que compraram e
            receberam este produto.
          </p>
        </div>

        <div className="w-fit rounded-3xl bg-white/15 px-5 py-4 shadow-inner backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black">
              {media.toFixed(1)}
            </span>

            <div>
              <div className="text-lg leading-none">
                <Stars
                  value={Math.round(
                    media,
                  )}
                />
              </div>

              <p className="mt-1 text-xs text-amber-100">
                {totalAvaliacoes}{' '}
                {totalAvaliacoes === 1
                  ? 'avaliação'
                  : 'avaliações'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}