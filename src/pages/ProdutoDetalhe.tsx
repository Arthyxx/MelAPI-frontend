import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findProdutoById } from '../services/produtoService';
import {
  canReviewProduto,
  findAvaliacoesByProdutoId,
} from '../services/avaliacaoProdutoService';
import type { Produto } from '../types/produto';
import type {
  AvaliacaoProduto,
  CanReviewProduto,
} from '../types/avaliacaoProduto';
import { formatCurrency } from '../utils/formatCurrency';
import { addToCart, getCartItemsCount } from '../utils/cart';
import { decodeToken } from '../utils/decodeToken';
import { AvaliacoesProduto } from '../components/produtos/AvaliacoesProduto';

export function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoProduto[]>([]);
  const [canReview, setCanReview] = useState<CanReviewProduto | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);
  const [loadingCanReview, setLoadingCanReview] = useState(false);

  const [error, setError] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(getCartItemsCount());

  const token = localStorage.getItem('token');
  const isLogged = !!token;

  const decodedToken = token ? decodeToken(token) : null;
  const clienteId = decodedToken?.id;

  const minhaAvaliacao = useMemo(() => {
    if (clienteId == null) {
      return null;
    }

    return (
      avaliacoes.find(
        (avaliacao) => Number(avaliacao.clienteId) === Number(clienteId)
      ) || null
    );
  }, [avaliacoes, clienteId]);

  const reloadCanReview = async () => {
    if (!id || !token) {
      setCanReview(null);
      setLoadingCanReview(false);
      return;
    }

    try {
      setLoadingCanReview(true);

      const canReviewData = await canReviewProduto(id);

      setCanReview(canReviewData);
    } catch (err: any) {
      console.error('Erro ao verificar permissão de avaliação:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setCanReview({
        canReview: false,
        message:
          'Não foi possível verificar se você pode avaliar este produto agora.',
      });
    } finally {
      setLoadingCanReview(false);
    }
  };

  const reloadAvaliacoes = async () => {
    if (!id) return;

    try {
      setLoadingAvaliacoes(true);

      const avaliacoesData = await findAvaliacoesByProdutoId(id);

      setAvaliacoes(avaliacoesData);
    } catch (err: any) {
      console.error('Erro ao recarregar avaliações:', {
        statusCode: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    } finally {
      setLoadingAvaliacoes(false);
    }

    await reloadCanReview();
  };

  useEffect(() => {
    const fetchProdutoDetalhe = async () => {
      try {
        setError('');
        setLoading(true);
        setLoadingAvaliacoes(true);

        if (!id) {
          navigate('/produtos');
          return;
        }

        const produtoData = await findProdutoById(id);
        setProduto(produtoData);

        const avaliacoesData = await findAvaliacoesByProdutoId(id);
        setAvaliacoes(avaliacoesData);
      } catch (err: any) {
        console.error('Erro ao carregar detalhe do produto:', {
          statusCode: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        setError('Não foi possível carregar os detalhes deste produto.');
      } finally {
        setLoading(false);
        setLoadingAvaliacoes(false);
      }
    };

    fetchProdutoDetalhe();
  }, [id, navigate]);

  useEffect(() => {
    reloadCanReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const handleAddToCart = () => {
    if (!produto) return;

    if (!isLogged) {
      navigate('/login');
      return;
    }

    try {
      const updatedCart = addToCart({
        id: produto.id,
        name: produto.name,
        price: produto.price,
        stockQuantity: produto.stockQuantity,
        imageUrl: produto.imageUrl,
      });

      const totalItems = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartItemsCount(totalItems);

      alert(`🍯 ${produto.name} adicionado ao carrinho!`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro ao adicionar produto ao carrinho.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="relative">
          <div className="mb-4 text-8xl drop-shadow-lg animate-bounce-soft">
            🍯
          </div>

          <div className="absolute inset-0 rounded-full bg-amber-200/30 blur-xl animate-pulse-gentle" />
        </div>

        <p className="mt-4 text-xl font-bold text-amber-700 dark:text-amber-300">
          Carregando produto...
        </p>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl dark:border-red-900 dark:bg-gray-900">
          <div className="mb-4 text-6xl">⚠️</div>

          <h1 className="text-2xl font-black text-red-700 dark:text-red-300">
            Produto não encontrado
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {error || 'Não conseguimos encontrar esse produto.'}
          </p>

          <Link
            to="/produtos"
            className="mt-6 inline-flex rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
          >
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  const semEstoque = produto.stockQuantity <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-950/90 text-white shadow-xl backdrop-blur-md dark:bg-gray-950/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link to="/produtos" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-inner">
                <span className="text-3xl">🍯</span>
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight md:text-2xl">
                  Apiário Vitória Seven
                </h1>

                <p className="text-xs text-amber-100 md:text-sm">
                  Detalhes do produto
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/produtos"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
              >
                <span>←</span>
                Produtos
              </Link>

              {isLogged ? (
                <Link
                  to="/carrinho"
                  className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
                >
                  <span>🛒</span>
                  Carrinho

                  {cartItemsCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-md">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
                >
                  <span>🔐</span>
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-950 dark:via-gray-900 dark:to-gray-950">
              <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl animate-pulse-gentle" />
              <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl animate-pulse-gentle" />

              {produto.imageUrl ? (
                <img
                  src={produto.imageUrl}
                  alt={produto.name}
                  className="relative z-10 h-full w-full object-cover"
                />
              ) : (
                <div className="relative z-10 text-center">
                  <div className="text-9xl drop-shadow-2xl animate-bounce-soft">
                    🍯
                  </div>

                  <p className="mt-4 rounded-full bg-white/70 px-5 py-2 text-sm font-black text-amber-900 shadow-md backdrop-blur-md">
                    Produto artesanal
                  </p>
                </div>
              )}

              {semEstoque && (
                <span className="absolute right-5 top-5 z-20 rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white shadow-lg">
                  Sem estoque
                </span>
              )}
            </div>

            <div className="p-6 sm:p-10">
              <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-amber-800">
                Produto natural
              </span>

              <h2 className="mt-5 text-4xl font-black leading-tight text-amber-950 dark:text-amber-300 md:text-5xl">
                {produto.name}
              </h2>

              <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {produto.description ||
                  'Produto artesanal selecionado do Apiário Vitória Seven. Ideal para quem busca qualidade, sabor e produtos naturais direto do produtor.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  🐝 Natural
                </span>

                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
                  🍯 Artesanal
                </span>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                  📦 Estoque: {produto.stockQuantity}
                </span>
              </div>

              <div className="mt-8 rounded-3xl border border-amber-100 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
                <p className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Preço
                </p>

                <p className="mt-1 text-5xl font-black text-amber-700 dark:text-amber-300">
                  {formatCurrency(produto.price)}
                </p>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Valor sem taxa de entrega. Entrega a combinar com o vendedor.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={semEstoque}
                  className={`group relative overflow-hidden rounded-2xl px-6 py-4 font-black shadow-xl transition duration-300 ${
                    semEstoque
                      ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      : isLogged
                        ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white hover:-translate-y-1 hover:shadow-2xl'
                        : 'bg-gradient-to-r from-amber-950 to-amber-800 text-white hover:-translate-y-1 hover:shadow-2xl'
                  }`}
                >
                  {!semEstoque && (
                    <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover:translate-x-[100%]" />
                  )}

                  <span className="relative flex items-center justify-center gap-2">
                    {semEstoque ? (
                      <>
                        <span>🚫</span>
                        Indisponível
                      </>
                    ) : isLogged ? (
                      <>
                        <span>🛒</span>
                        Adicionar ao carrinho
                      </>
                    ) : (
                      <>
                        <span>🔐</span>
                        Entrar para comprar
                      </>
                    )}
                  </span>
                </button>

                <Link
                  to="/produtos"
                  className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-6 py-4 font-black text-amber-800 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-800 dark:bg-gray-950 dark:text-amber-300 dark:hover:bg-gray-900"
                >
                  Ver outros produtos
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-amber-200 bg-white/85 p-5 shadow-md dark:border-amber-800 dark:bg-gray-900/85">
            <div className="text-3xl">🐝</div>

            <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
              Origem natural
            </h3>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Produto selecionado com foco em qualidade e procedência.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-white/85 p-5 shadow-md dark:border-amber-800 dark:bg-gray-900/85">
            <div className="text-3xl">📦</div>

            <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
              Entrega a combinar
            </h3>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              O vendedor pode confirmar valor e forma de entrega após o pedido.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-white/85 p-5 shadow-md dark:border-amber-800 dark:bg-gray-900/85">
            <div className="text-3xl">⭐</div>

            <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
              Avaliações reais
            </h3>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Veja opiniões de clientes sobre este produto.
            </p>
          </div>
        </section>
        <AvaliacoesProduto
          produtoId={produto.id}
          avaliacoes={avaliacoes}
          loading={loadingAvaliacoes}
          isLogged={isLogged}
          minhaAvaliacao={minhaAvaliacao}
          canReview={canReview}
          loadingCanReview={loadingCanReview}
          onSuccess={reloadAvaliacoes}
        />
      </main>
    </div>
  );
}