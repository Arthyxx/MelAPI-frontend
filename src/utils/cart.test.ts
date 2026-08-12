import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  addToCart,
  clearCart,
  getCart,
  getCartItemsCount,
  getCartTotal,
  removeFromCart,
} from './cart';

const produto = {
  id: 1,
  name: 'Mel Silvestre',
  price: 25,
  stockQuantity: 5,
  imageUrl:
    'https://exemplo.com/mel.jpg',
};

function toBase64Url(
  value: string,
): string {
  return btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createTestToken(
  sub: number,
  email: string,
): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub,
    email,
    role: 'CLIENTE',
    exp:
      Math.floor(
        Date.now() / 1000,
      ) + 3600,
  };

  return [
    toBase64Url(
      JSON.stringify(header),
    ),
    toBase64Url(
      JSON.stringify(payload),
    ),
    'assinatura-ficticia',
  ].join('.');
}

describe('cart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve iniciar com o carrinho vazio', () => {
    expect(getCart()).toEqual([]);
  });

  it('deve adicionar um produto ao carrinho', () => {
    const cart =
      addToCart(produto);

    expect(cart).toHaveLength(1);

    expect(cart[0]).toEqual({
      ...produto,
      quantity: 1,
    });
  });

  it('deve aumentar a quantidade de um produto já existente', () => {
    addToCart(produto);

    const cart =
      addToCart(produto);

    expect(cart).toHaveLength(1);

    expect(
      cart[0].quantity,
    ).toBe(2);
  });

  it('não deve ultrapassar o estoque disponível', () => {
    const produtoComEstoqueUm = {
      ...produto,
      stockQuantity: 1,
    };

    addToCart(
      produtoComEstoqueUm,
    );

    expect(() =>
      addToCart(
        produtoComEstoqueUm,
      ),
    ).toThrow(
      'Quantidade máxima em estoque atingida.',
    );
  });

  it('não deve adicionar produto sem estoque', () => {
    expect(() =>
      addToCart({
        ...produto,
        stockQuantity: 0,
      }),
    ).toThrow(
      'Produto sem estoque.',
    );
  });

  it('deve remover um produto do carrinho', () => {
    addToCart(produto);

    const cart =
      removeFromCart(produto.id);

    expect(cart).toEqual([]);
  });

  it('deve limpar o carrinho', () => {
    addToCart(produto);

    clearCart();

    expect(getCart()).toEqual([]);
  });

  it('deve calcular o total e a quantidade de itens', () => {
    addToCart(produto);
    addToCart(produto);

    addToCart({
      id: 2,
      name: 'Própolis',
      price: 10,
      stockQuantity: 3,
    });

    expect(
      getCartItemsCount(),
    ).toBe(3);

    expect(
      getCartTotal(),
    ).toBe(60);
  });

  it('deve usar um carrinho separado para cada cliente autenticado', () => {
    const tokenCliente1 =
      createTestToken(
        10,
        'cliente1@email.com',
      );

    const tokenCliente2 =
      createTestToken(
        20,
        'cliente2@email.com',
      );

    localStorage.setItem(
      'token',
      tokenCliente1,
    );

    addToCart(produto);

    expect(
      getCart(),
    ).toHaveLength(1);

    localStorage.setItem(
      'token',
      tokenCliente2,
    );

    expect(
      getCart(),
    ).toEqual([]);

    addToCart({
      id: 2,
      name: 'Própolis',
      price: 10,
      stockQuantity: 3,
    });

    expect(
      getCart()[0].id,
    ).toBe(2);

    localStorage.setItem(
      'token',
      tokenCliente1,
    );

    expect(
      getCart(),
    ).toHaveLength(1);

    expect(
      getCart()[0].id,
    ).toBe(1);
  });

  it('deve manter o carrinho do visitante separado do cliente autenticado', () => {
    addToCart(produto);

    expect(
      getCart(),
    ).toHaveLength(1);

    const token =
      createTestToken(
        30,
        'cliente@email.com',
      );

    localStorage.setItem(
      'token',
      token,
    );

    expect(
      getCart(),
    ).toEqual([]);

    localStorage.removeItem(
      'token',
    );

    expect(
      getCart(),
    ).toHaveLength(1);
  });

  it('deve salvar o carrinho autenticado usando o id do cliente', () => {
    const token =
      createTestToken(
        42,
        'cliente42@email.com',
      );

    localStorage.setItem(
      'token',
      token,
    );

    addToCart(produto);

    const storedCart =
      localStorage.getItem(
        'cart_cliente_42',
      );

    expect(
      storedCart,
    ).not.toBeNull();

    expect(
      JSON.parse(
        storedCart ?? '[]',
      ),
    ).toHaveLength(1);
  });
});