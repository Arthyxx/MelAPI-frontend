import { decodeToken } from './decodeToken';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  imageUrl?: string;
}

const LEGACY_CART_KEY = 'cart';
const INVALID_CART_KEY = 'cart_cliente_undefined';
const GUEST_CART_KEY = 'cart_visitante';

function getCartKey(): string {
  const token = localStorage.getItem('token');

  if (!token) {
    return GUEST_CART_KEY;
  }

  const decodedToken = decodeToken(token);

  if (!decodedToken) {
    return GUEST_CART_KEY;
  }

  return `cart_cliente_${decodedToken.sub}`;
}

function parseCart(
  storedCart: string | null,
): CartItem[] {
  if (!storedCart) {
    return [];
  }

  try {
    const parsedCart: unknown =
      JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(
      (item): item is CartItem => {
        if (
          typeof item !== 'object' ||
          item === null
        ) {
          return false;
        }

        const cartItem =
          item as Partial<CartItem>;

        return (
          typeof cartItem.id === 'number' &&
          typeof cartItem.name === 'string' &&
          typeof cartItem.price === 'number' &&
          typeof cartItem.quantity === 'number' &&
          typeof cartItem.stockQuantity ===
            'number'
        );
      },
    );
  } catch {
    return [];
  }
}

function migrateCart(
  sourceKey: string,
  destinationKey: string,
): boolean {
  if (
    sourceKey === destinationKey ||
    localStorage.getItem(destinationKey)
  ) {
    return false;
  }

  const sourceCart =
    localStorage.getItem(sourceKey);

  if (!sourceCart) {
    return false;
  }

  localStorage.setItem(
    destinationKey,
    sourceCart,
  );

  localStorage.removeItem(sourceKey);

  return true;
}

function migratePreviousCarts(
  destinationKey: string,
): void {
  if (destinationKey === GUEST_CART_KEY) {
    return;
  }

  const migratedInvalidCart = migrateCart(
    INVALID_CART_KEY,
    destinationKey,
  );

  if (!migratedInvalidCart) {
    migrateCart(
      LEGACY_CART_KEY,
      destinationKey,
    );
  }
}

export function getCart(): CartItem[] {
  const cartKey = getCartKey();

  migratePreviousCarts(cartKey);

  return parseCart(
    localStorage.getItem(cartKey),
  );
}

export function saveCart(
  items: CartItem[],
): void {
  const cartKey = getCartKey();

  localStorage.setItem(
    cartKey,
    JSON.stringify(items),
  );
}

export function addToCart(
  product: Omit<CartItem, 'quantity'>,
): CartItem[] {
  const cart = getCart();

  const existingItem = cart.find(
    (item) => item.id === product.id,
  );

  if (existingItem) {
    if (
      existingItem.quantity >=
      product.stockQuantity
    ) {
      throw new Error(
        'Quantidade máxima em estoque atingida.',
      );
    }

    existingItem.quantity += 1;
    existingItem.stockQuantity =
      product.stockQuantity;
    existingItem.price = product.price;
    existingItem.name = product.name;
    existingItem.imageUrl =
      product.imageUrl;
  } else {
    if (product.stockQuantity <= 0) {
      throw new Error(
        'Produto sem estoque.',
      );
    }

    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);

  return cart;
}

export function removeFromCart(
  productId: number,
): CartItem[] {
  const cart = getCart().filter(
    (item) => item.id !== productId,
  );

  saveCart(cart);

  return cart;
}

export function clearCart(): void {
  localStorage.removeItem(
    getCartKey(),
  );
}

export function getCartTotal(): number {
  return getCart().reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0,
  );
}

export function getCartItemsCount(): number {
  return getCart().reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );
}