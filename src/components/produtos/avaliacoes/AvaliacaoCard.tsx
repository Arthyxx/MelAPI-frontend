import type {
  AvaliacaoProduto,
} from '../../../types/avaliacaoProduto';
import {
  formatDate,
} from '../../../utils/formatDate';

import {
  Stars,
} from './Stars';

interface AvaliacaoCardProps {
  avaliacao: AvaliacaoProduto;
}

export function AvaliacaoCard({
  avaliacao,
}: AvaliacaoCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-xl shadow-sm dark:bg-amber-950/40">
            👤
          </div>

          <div>
            <h4 className="font-black text-gray-900 dark:text-white">
              {avaliacao.clienteName ||
                'Cliente'}
            </h4>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="text-base leading-none">
                <Stars
                  value={
                    avaliacao.rating
                  }
                />
              </div>

              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {avaliacao.rating}/5
              </span>

              <span className="text-gray-300 dark:text-gray-700">
                •
              </span>

              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {formatDate(
                  avaliacao.createdAt,
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {avaliacao.comment ? (
        <p className="mt-5 border-t border-gray-100 pt-5 text-sm leading-relaxed text-gray-700 dark:border-gray-800 dark:text-gray-300">
          “{avaliacao.comment}”
        </p>
      ) : (
        <p className="mt-5 border-t border-gray-100 pt-5 text-sm italic text-gray-400 dark:border-gray-800">
          Cliente avaliou sem
          comentário.
        </p>
      )}
    </article>
  );
}