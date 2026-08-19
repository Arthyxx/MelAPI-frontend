import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useNavigate,
} from 'react-router-dom';

import type {
  Produto,
} from '../../types/produto';

import {
  addToCart,
  getCartItemsCount,
  type CartItem,
} from '../../utils/cart';

interface UseProdutoDetalheCartOptions {
  produto: Produto | null;
  isAuthenticated: boolean;
}

export function useProdutoDetalheCart({
  produto,
  isAuthenticated,
}: UseProdutoDetalheCartOptions) {
  const navigate = useNavigate();

  const [
    cartItemsCount,
    setCartItemsCount,
  ] = useState(
    getCartItemsCount(),
  );

  const [
    toastVisible,
    setToastVisible,
  ] = useState(false);

  const [
    toastMessage,
    setToastMessage,
  ] = useState('');

  const toastTimeoutRef =
    useRef<number | null>(
      null,
    );

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          toastTimeoutRef.current,
        );
      }
    };
  }, []);

  const showCartToast = (
    message: string,
  ) => {
    setToastMessage(message);
    setToastVisible(true);

    if (
      toastTimeoutRef.current !==
      null
    ) {
      window.clearTimeout(
        toastTimeoutRef.current,
      );
    }

    toastTimeoutRef.current =
      window.setTimeout(() => {
        setToastVisible(false);
      }, 3000);
  };

  const closeToast = () => {
    setToastVisible(false);
  };

  const handleAddToCart = () => {
    if (!produto) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');

      return;
    }

    try {
      const updatedCart =
        addToCart({
          id: produto.id,
          name: produto.name,
          price: produto.price,
          stockQuantity:
            produto.stockQuantity,
          imageUrl:
            produto.imageUrl,
        });

      const totalItems =
        updatedCart.reduce(
          (
            total: number,
            item: CartItem,
          ) =>
            total +
            item.quantity,
          0,
        );

      setCartItemsCount(
        totalItems,
      );

      showCartToast(
        `${produto.name} foi adicionado ao carrinho.`,
      );
    } catch (error) {
      if (
        error instanceof Error
      ) {
        alert(error.message);

        return;
      }

      alert(
        'Erro ao adicionar produto ao carrinho.',
      );
    }
  };

  return {
    cartItemsCount,

    toastVisible,
    toastMessage,

    handleAddToCart,
    closeToast,
  };
}