import type {
  AvaliacaoProduto,
} from '../../../types/avaliacaoProduto';

import {
  AvaliacaoCard,
} from './AvaliacaoCard';

interface AvaliacoesListProps {
  avaliacoes: AvaliacaoProduto[];
}

export function AvaliacoesList({
  avaliacoes,
}: AvaliacoesListProps) {
  return (
    <div className="border-t border-amber-100 pt-8 dark:border-amber-900">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
          ⭐
        </div>

        <div>
          <h4 className="font-black text-gray-900 dark:text-white">
            Avaliações dos clientes
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comentários de quem já
            recebeu o produto.
          </p>
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="text-5xl">
            ⭐
          </div>

          <h4 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
            Ainda não há outras
            avaliações
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
            Nenhum outro cliente
            avaliou este produto ainda.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {avaliacoes.map(
            (avaliacao) => (
              <AvaliacaoCard
                key={avaliacao.id}
                avaliacao={
                  avaliacao
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}