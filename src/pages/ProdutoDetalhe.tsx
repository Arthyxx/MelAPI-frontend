import {
  useParams,
} from 'react-router-dom';

import {
  AvaliacoesProduto,
} from '../components/produtos/AvaliacoesProduto';
import {
  ProdutoDetalheError,
} from '../components/produtos/detalhe/ProdutoDetalheError';
import {
  ProdutoDetalheHeader,
} from '../components/produtos/detalhe/ProdutoDetalheHeader';
import {
  ProdutoDetalheInfoCards,
} from '../components/produtos/detalhe/ProdutoDetalheInfoCards';
import {
  ProdutoDetalheLoading,
} from '../components/produtos/detalhe/ProdutoDetalheLoading';
import {
  ProdutoDetalheMain,
} from '../components/produtos/detalhe/ProdutoDetalheMain';
import {
  CartToast,
} from '../components/ui/CartToast';

import {
  useAuth,
} from '../contexts/useAuth';

import {
  useProdutoDetalheCart,
} from './produto-detalhe/useProdutoDetalheCart';
import {
  useProdutoDetalheData,
} from './produto-detalhe/useProdutoDetalheData';

export function ProdutoDetalhe() {
  const { id } = useParams();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const produtoData =
    useProdutoDetalheData({
      id,
      isAuthenticated,
      clienteId: user?.id,
    });

  const carrinho =
    useProdutoDetalheCart({
      produto:
        produtoData.produto,
      isAuthenticated,
    });

  if (produtoData.loading) {
    return (
      <ProdutoDetalheLoading />
    );
  }

  if (
    produtoData.error ||
    !produtoData.produto
  ) {
    return (
      <ProdutoDetalheError
        message={
          produtoData.error
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <ProdutoDetalheHeader
        isLogged={
          isAuthenticated
        }
        cartItemsCount={
          carrinho.cartItemsCount
        }
      />

      <CartToast
        message={
          carrinho.toastMessage
        }
        visible={
          carrinho.toastVisible
        }
        onClose={
          carrinho.closeToast
        }
      />

      <main className="container mx-auto px-4 py-10">
        <ProdutoDetalheMain
          produto={
            produtoData.produto
          }
          isLogged={
            isAuthenticated
          }
          onAddToCart={
            carrinho.handleAddToCart
          }
        />

        <ProdutoDetalheInfoCards />

        <AvaliacoesProduto
          produtoId={
            produtoData.produto.id
          }
          avaliacoes={
            produtoData.avaliacoes
          }
          loading={
            produtoData
              .loadingAvaliacoes
          }
          isLogged={
            isAuthenticated
          }
          minhaAvaliacao={
            produtoData
              .minhaAvaliacao
          }
          canReview={
            produtoData.canReview
          }
          loadingCanReview={
            produtoData
              .loadingCanReview
          }
          onSuccess={
            produtoData
              .reloadAvaliacoes
          }
        />
      </main>
    </div>
  );
}