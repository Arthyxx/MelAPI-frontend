import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../../types/avaliacaoProduto';

import {
  AvaliacoesHeader,
} from './avaliacoes/AvaliacoesHeader';
import {
  AvaliacoesList,
} from './avaliacoes/AvaliacoesList';
import {
  AvaliacoesLoading,
} from './avaliacoes/AvaliacoesLoading';
import {
  MinhaAvaliacaoArea,
} from './avaliacoes/MinhaAvaliacaoArea';
import {
  calcularMediaAvaliacoes,
  filtrarOutrasAvaliacoes,
} from './avaliacoes/avaliacao.utils';
import {
  useAvaliacaoProduto,
} from './avaliacoes/useAvaliacaoProduto';

interface AvaliacoesProdutoProps {
  produtoId: string | number;
  avaliacoes: AvaliacaoProduto[];
  loading: boolean;
  isLogged: boolean;
  minhaAvaliacao?: AvaliacaoProduto | null;
  canReview?: CanReviewProduto | null;
  loadingCanReview?: boolean;
  onSuccess: () => Promise<void> | void;
}

export function AvaliacoesProduto({
  produtoId,
  avaliacoes,
  loading,
  isLogged,
  minhaAvaliacao,
  canReview,
  loadingCanReview = false,
  onSuccess,
}: AvaliacoesProdutoProps) {
  const avaliacao =
    useAvaliacaoProduto({
      produtoId,
      minhaAvaliacao,
      canReview,
      onSuccess,
    });

  const media =
    calcularMediaAvaliacoes(
      avaliacoes,
    );

  const outrasAvaliacoes =
    filtrarOutrasAvaliacoes(
      avaliacoes,
      minhaAvaliacao,
    );

  if (loading) {
    return (
      <AvaliacoesLoading />
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 shadow-xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
      <AvaliacoesHeader
        media={media}
        totalAvaliacoes={
          avaliacoes.length
        }
      />

      <div className="space-y-8 p-6">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
              ✍️
            </div>

            <div>
              <h4 className="font-black text-gray-900 dark:text-white">
                Sua avaliação
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avalie apenas produtos
                comprados e entregues.
              </p>
            </div>
          </div>

          <MinhaAvaliacaoArea
            isLogged={isLogged}
            minhaAvaliacao={
              minhaAvaliacao
            }
            canReview={canReview}
            loadingCanReview={
              loadingCanReview
            }
            rating={
              avaliacao.rating
            }
            comment={
              avaliacao.comment
            }
            saving={
              avaliacao.saving
            }
            deleting={
              avaliacao.deleting
            }
            editingMinhaAvaliacao={
              avaliacao
                .editingMinhaAvaliacao
            }
            error={
              avaliacao.error
            }
            success={
              avaliacao.success
            }
            onRatingChange={
              avaliacao.setRating
            }
            onCommentChange={
              avaliacao.setComment
            }
            onSubmit={
              avaliacao.handleSubmit
            }
            onStartEdit={
              avaliacao
                .handleStartEdit
            }
            onCancelEdit={
              avaliacao
                .handleCancelEdit
            }
            onDelete={
              avaliacao.handleDelete
            }
          />
        </div>

        <AvaliacoesList
          avaliacoes={
            outrasAvaliacoes
          }
        />
      </div>
    </section>
  );
}