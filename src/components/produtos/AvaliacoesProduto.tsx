import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../../types/avaliacaoProduto';
import {
  createAvaliacaoProduto,
  deleteMinhaAvaliacaoProduto,
  updateMinhaAvaliacaoProduto,
} from '../../services/avaliacaoProdutoService';
import { formatDate } from '../../utils/formatDate';

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
  const [rating, setRating] = useState(minhaAvaliacao?.rating || 5);
  const [comment, setComment] = useState(minhaAvaliacao?.comment || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditing = !!minhaAvaliacao;
  const canCreateReview = !!canReview?.canReview;

  const media =
    avaliacoes.length > 0
      ? avaliacoes.reduce((sum, avaliacao) => sum + avaliacao.rating, 0) /
        avaliacoes.length
      : 0;

  useEffect(() => {
    setRating(minhaAvaliacao?.rating || 5);
    setComment(minhaAvaliacao?.comment || '');
    setError('');
    setSuccess('');
  }, [minhaAvaliacao]);

  const renderStars = (value: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < value;

      return (
        <span
          key={index}
          className={filled ? 'text-yellow-500' : 'text-gray-300'}
        >
          ★
        </span>
      );
    });
  };

  const renderStarsButton = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const value = index + 1;
      const selected = value <= rating;

      return (
        <button
          key={value}
          type="button"
          onClick={() => setRating(value)}
          className={`text-4xl transition hover:-translate-y-1 ${
            selected ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-300'
          }`}
          aria-label={`Avaliar com ${value} estrela${value > 1 ? 's' : ''}`}
        >
          ★
        </button>
      );
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEditing && !canCreateReview) {
      setError(
        canReview?.message ||
          'Você só poderá avaliar este produto após receber o pedido.'
      );
      return;
    }

    try {
      setError('');
      setSuccess('');
      setSaving(true);

      const payload = {
        rating,
        comment: comment.trim() || undefined,
      };

      if (isEditing) {
        await updateMinhaAvaliacaoProduto(produtoId, payload);
        setSuccess('Avaliação atualizada com sucesso!');
      } else {
        await createAvaliacaoProduto(produtoId, payload);
        setSuccess('Avaliação enviada com sucesso!');
      }

      await onSuccess();
    } catch (err: any) {
      console.error('Erro ao salvar avaliação:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao salvar avaliação. Tente novamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja remover sua avaliação?'
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');
      setDeleting(true);

      await deleteMinhaAvaliacaoProduto(produtoId);

      setRating(5);
      setComment('');
      setSuccess('Avaliação removida com sucesso!');

      await onSuccess();
    } catch (err: any) {
      console.error('Erro ao remover avaliação:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Erro ao remover avaliação. Tente novamente.'
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderMinhaAvaliacaoArea = () => {
    if (!isLogged) {
      return (
        <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 p-6 text-center dark:border-amber-800 dark:bg-amber-950/20">
          <div className="text-5xl">🔐</div>

          <h4 className="mt-4 text-xl font-black text-amber-900 dark:text-amber-300">
            Entre para avaliar
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            Você pode ver avaliações sem login, mas para avaliar precisa entrar
            na sua conta.
          </p>

          <Link
            to="/login"
            className="mt-5 inline-flex rounded-2xl bg-amber-600 px-6 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
          >
            Entrar para avaliar
          </Link>
        </div>
      );
    }

    if (loadingCanReview && !isEditing) {
      return (
        <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-6 text-center dark:border-amber-900 dark:bg-amber-950/20">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-300 border-t-amber-700" />

          <p className="mt-4 font-bold text-amber-900 dark:text-amber-300">
            Verificando se você pode avaliar este produto...
          </p>
        </div>
      );
    }

    if (!isEditing && !canCreateReview) {
      return (
        <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 p-6 text-center dark:border-amber-800 dark:bg-amber-950/20">
          <div className="text-5xl">📦</div>

          <h4 className="mt-4 text-xl font-black text-amber-900 dark:text-amber-300">
            Avaliação disponível após entrega
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            {canReview?.message ||
              'Você poderá avaliar este produto depois que um pedido contendo ele estiver entregue.'}
          </p>

          <Link
            to="/meus-pedidos"
            className="mt-5 inline-flex rounded-2xl border border-amber-200 bg-white px-6 py-3 font-black text-amber-800 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
          >
            Ver meus pedidos
          </Link>
        </div>
      );
    }

    return (
      <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-5 dark:border-amber-900 dark:bg-amber-950/20">
        <div className="mb-5">
          <h4 className="text-xl font-black text-amber-900 dark:text-amber-300">
            {isEditing ? 'Editar sua avaliação' : 'Deixe sua avaliação'}
          </h4>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {isEditing
              ? 'Você já avaliou este produto. Pode editar ou remover sua avaliação.'
              : 'Conte sua experiência depois de receber o produto.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-black text-amber-900 dark:text-amber-300">
              Nota do produto
            </label>

            <div className="flex flex-wrap gap-2">{renderStarsButton()}</div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Nota selecionada: {rating}/5
            </p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-black text-amber-900 dark:text-amber-300">
              Comentário
            </label>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="Conte o que achou do produto..."
              className="w-full resize-none rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-gray-900 shadow-sm outline-none transition duration-300 placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 dark:border-amber-800 dark:bg-gray-950/80 dark:text-white dark:focus:ring-amber-900"
            />

            <p className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
              {comment.length}/1000
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="rounded-2xl border border-red-200 bg-red-50 px-6 py-3 font-black text-red-700 shadow-sm transition hover:-translate-y-1 hover:bg-red-100 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              >
                {deleting ? 'Removendo...' : 'Remover avaliação'}
              </button>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Você poderá editar sua avaliação depois.
              </span>
            )}

            <button
              type="submit"
              disabled={saving || deleting}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-8 py-4 font-black text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />

              <span className="relative flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  <>
                    {isEditing ? 'Salvar alterações' : 'Enviar avaliação'}
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="mt-8 rounded-[2rem] border border-amber-200 bg-white/90 p-6 shadow-xl dark:border-amber-800 dark:bg-gray-900/90">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-amber-100" />

          <div>
            <div className="h-4 w-40 animate-pulse rounded bg-amber-100" />
            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-amber-50" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-3xl bg-amber-50" />
          <div className="h-28 animate-pulse rounded-3xl bg-amber-50" />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 shadow-xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
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
              Veja avaliações reais de clientes que compraram e receberam este
              produto.
            </p>
          </div>

          <div className="w-fit rounded-3xl bg-white/15 px-5 py-4 shadow-inner backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black">{media.toFixed(1)}</span>

              <div>
                <div className="text-lg leading-none">
                  {renderStars(Math.round(media))}
                </div>

                <p className="mt-1 text-xs text-amber-100">
                  {avaliacoes.length}{' '}
                  {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
              ✍️
            </div>

            <div>
              <h4 className="font-black text-amber-900 dark:text-amber-300">
                Sua avaliação
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avalie apenas produtos comprados e entregues.
              </p>
            </div>
          </div>

          {renderMinhaAvaliacaoArea()}
        </div>

        <div className="border-t border-amber-100 pt-8 dark:border-amber-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
              ⭐
            </div>

            <div>
              <h4 className="font-black text-amber-900 dark:text-amber-300">
                Avaliações dos clientes
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comentários de quem já recebeu o produto.
              </p>
            </div>
          </div>

          {avaliacoes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 p-8 text-center dark:border-amber-800 dark:bg-amber-950/20">
              <div className="text-6xl">⭐</div>

              <h4 className="mt-4 text-2xl font-black text-amber-900 dark:text-amber-300">
                Ainda não há avaliações
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
                Nenhum cliente avaliou este produto ainda.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {avaliacoes.map((avaliacao) => (
                <article
                  key={avaliacao.id}
                  className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-amber-900 dark:bg-gray-950"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm dark:bg-amber-950">
                        👤
                      </div>

                      <div>
                        <h4 className="font-black text-amber-950 dark:text-amber-300">
                          {avaliacao.clienteName || 'Cliente'}
                        </h4>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Avaliado em {formatDate(avaliacao.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="text-xl">
                      {renderStars(avaliacao.rating)}
                    </div>
                  </div>

                  {avaliacao.comment ? (
                    <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      {avaliacao.comment}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm italic text-gray-400">
                      Cliente avaliou sem comentário.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}