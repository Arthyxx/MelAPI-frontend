import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { addToCart, getCart } from "../../utils/cart";

import { useCarrinho } from "./useCarrinho";

const produto = {
  id: 1,
  name: "Mel Silvestre",
  price: 25,
  stockQuantity: 5,
};

const segundoProduto = {
  id: 2,
  name: "Própolis",
  price: 10,
  stockQuantity: 3,
};

describe("useCarrinho", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve carregar os itens persistidos no carrinho", () => {
    addToCart(produto);
    addToCart(produto);
    addToCart(segundoProduto);

    const { result } = renderHook(() => useCarrinho());

    expect(result.current.items).toHaveLength(2);

    expect(result.current.totalItems).toBe(3);

    expect(result.current.subtotal).toBe(60);

    expect(result.current.isEmpty).toBe(false);
  });

  it("deve atualizar a quantidade e persistir a alteração", () => {
    addToCart(produto);

    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.updateQuantity(1, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);

    expect(getCart()[0].quantity).toBe(3);

    expect(result.current.totalItems).toBe(3);

    expect(result.current.subtotal).toBe(75);
  });

  it("deve limitar a quantidade entre um e o estoque disponível", () => {
    addToCart(produto);

    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.items[0].quantity).toBe(1);

    act(() => {
      result.current.updateQuantity(1, 99);
    });

    expect(result.current.items[0].quantity).toBe(5);

    expect(getCart()[0].quantity).toBe(5);
  });

  it("deve remover um item do carrinho", () => {
    addToCart(produto);
    addToCart(segundoProduto);

    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.removeItem(1);
    });

    expect(result.current.items).toHaveLength(1);

    expect(result.current.items[0].id).toBe(2);

    expect(getCart()).toHaveLength(1);

    expect(getCart()[0].id).toBe(2);
  });

  it("não deve abrir confirmação para carrinho vazio", () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.openClearCartModal();
    });

    expect(result.current.clearCartModalOpen).toBe(false);
  });

  it("deve abrir e fechar o modal de limpeza", () => {
    addToCart(produto);

    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.openClearCartModal();
    });

    expect(result.current.clearCartModalOpen).toBe(true);

    act(() => {
      result.current.closeClearCartModal();
    });

    expect(result.current.clearCartModalOpen).toBe(false);
  });

  it("deve limpar todos os itens após confirmação", () => {
    addToCart(produto);
    addToCart(segundoProduto);

    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.openClearCartModal();
    });

    act(() => {
      result.current.clearAllItems();
    });

    expect(result.current.items).toEqual([]);

    expect(result.current.isEmpty).toBe(true);

    expect(result.current.clearCartModalOpen).toBe(false);

    expect(getCart()).toEqual([]);
  });

  it("deve limpar os itens após a criação do pedido", () => {
    addToCart(produto);

    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.clearItemsAfterOrder();
    });

    expect(result.current.items).toEqual([]);

    expect(result.current.totalItems).toBe(0);

    expect(result.current.subtotal).toBe(0);

    expect(getCart()).toEqual([]);
  });
});
