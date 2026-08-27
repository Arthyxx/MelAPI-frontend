import {
  useMemo,
  useState,
} from 'react';

import {
  clearCart,
  getCart,
  removeFromCart,
  saveCart,
  type CartItem,
} from '../../utils/cart';

export function useCarrinho() {
  const [items, setItems] =
    useState<CartItem[]>(getCart);

  const [
    clearCartModalOpen,
    setClearCartModalOpen,
  ] = useState(false);

  const totalItems = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    );
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0,
    );
  }, [items]);

  const discount = 0;

  const isEmpty =
    items.length === 0;

  const updateQuantity = (
    productId: number,
    quantity: number,
  ) => {
    const updatedItems =
      items.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const safeQuantity =
          Math.max(
            1,
            Math.min(
              quantity,
              item.stockQuantity,
            ),
          );

        return {
          ...item,
          quantity: safeQuantity,
        };
      });

    setItems(updatedItems);
    saveCart(updatedItems);
  };

  const removeItem = (
    productId: number,
  ) => {
    const updatedItems =
      removeFromCart(productId);

    setItems(updatedItems);
  };

  const openClearCartModal = () => {
    if (items.length === 0) {
      return;
    }

    setClearCartModalOpen(true);
  };

  const closeClearCartModal = () => {
    setClearCartModalOpen(false);
  };

  const clearAllItems = () => {
    clearCart();
    setItems([]);
    setClearCartModalOpen(false);
  };

  const clearItemsAfterOrder = () => {
    clearCart();
    setItems([]);
  };

  return {
    items,
    totalItems,
    subtotal,
    discount,
    isEmpty,

    clearCartModalOpen,

    updateQuantity,
    removeItem,

    openClearCartModal,
    closeClearCartModal,
    clearAllItems,
    clearItemsAfterOrder,
  };
}