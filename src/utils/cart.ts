export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  imageUrl?: string;
}

const CART_KEY = 'cart';

export function getCart(): CartItem[] {
  const cart = localStorage.getItem(CART_KEY);

  if (!cart) {
    return [];
  }

  try {
    return JSON.parse(cart);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product: Omit<CartItem, 'quantity'>) {
  const cart = getCart();

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    if (existingItem.quantity >= product.stockQuantity) {
      throw new Error('Quantidade máxima em estoque atingida.');
    }

    existingItem.quantity += 1;
  } else {
    if (product.stockQuantity <= 0) {
      throw new Error('Produto sem estoque.');
    }

    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);

  return cart;
}

export function removeFromCart(productId: number) {
  const cart = getCart().filter((item) => item.id !== productId);

  saveCart(cart);

  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal() {
  return getCart().reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

export function getCartItemsCount() {
  return getCart().reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}