import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../contexts/useAuth";
import { findAllCategorias } from "../services/categoriaService";
import { findAllProdutos } from "../services/produtoService";
import type { Produto } from "../types/produto";

import { Produtos } from "./Produtos";

vi.mock("../contexts/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/categoriaService", () => ({
  findAllCategorias: vi.fn(),
}));

vi.mock("../services/produtoService", () => ({
  findAllProdutos: vi.fn(),
}));

vi.mock("../components/layout/StoreHeader", () => ({
  StoreHeader: () => null,
}));

vi.mock("../components/layout/StoreSidebarMenu", () => ({
  StoreSidebarMenu: () => null,
}));

vi.mock("../components/layout/StoreFooter", () => ({
  StoreFooter: () => null,
}));

vi.mock("../components/produtos/ProdutosBenefits", () => ({
  ProdutosBenefits: () => null,
}));

vi.mock("../components/produtos/ProdutosInstitutional", () => ({
  ProdutosInstitutional: () => null,
}));

vi.mock("../components/ui/CartToast", () => ({
  CartToast: () => null,
}));

vi.mock("../components/produtos/ProdutosHero", () => ({
  ProdutosHero: ({
    busca,
    somenteDisponiveis,
    onBuscaChange,
    onSomenteDisponiveisChange,
  }: {
    busca: string;
    somenteDisponiveis: boolean;
    onBuscaChange: (value: string) => void;
    onSomenteDisponiveisChange: (value: boolean) => void;
  }) => (
    <div>
      <input
        aria-label="Buscar produtos"
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
      />

      <button
        type="button"
        onClick={() => onSomenteDisponiveisChange(!somenteDisponiveis)}
      >
        Somente disponíveis
      </button>
    </div>
  ),
}));

vi.mock("../components/produtos/ProdutosGrid", () => ({
  ProdutosGrid: ({ produtos }: { produtos: Produto[] }) => (
    <div>
      {produtos.map((produto) => (
        <span key={produto.id}>{produto.name}</span>
      ))}
    </div>
  ),
}));

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

function createProduto(id: number, name: string, stockQuantity = 10): Produto {
  return {
    id,
    name,
    price: 40,
    stockQuantity,
    active: true,
  } as Produto;
}

function renderProdutos() {
  return render(
    <MemoryRouter>
      <Produtos />
    </MemoryRouter>,
  );
}

describe("Produtos", () => {
  const mockedUseAuth = vi.mocked(useAuth);

  const mockedFindAllCategorias = vi.mocked(findAllCategorias);

  const mockedFindAllProdutos = vi.mocked(findAllProdutos);

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    mockedFindAllCategorias.mockResolvedValue([]);
  });

  it("deve realizar somente uma consulta no primeiro carregamento", async () => {
    mockedFindAllProdutos.mockResolvedValue([
      createProduto(1, "Mel Silvestre"),
    ]);

    renderProdutos();

    await screen.findByText("Mel Silvestre");

    expect(mockedFindAllProdutos).toHaveBeenCalledTimes(1);

    expect(mockedFindAllProdutos).toHaveBeenCalledWith({
      name: "",
      active: true,
      sort: undefined,
    });
  });

  it("não deve consultar a API novamente ao filtrar somente produtos disponíveis", async () => {
    mockedFindAllProdutos.mockResolvedValue([
      createProduto(1, "Mel disponível", 5),
      createProduto(2, "Mel sem estoque", 0),
    ]);

    renderProdutos();

    await screen.findByText("Mel disponível");

    expect(screen.getByText("Mel sem estoque")).toBeInTheDocument();

    expect(mockedFindAllProdutos).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Somente disponíveis",
      }),
    );

    expect(screen.getByText("Mel disponível")).toBeInTheDocument();

    expect(screen.queryByText("Mel sem estoque")).not.toBeInTheDocument();

    expect(mockedFindAllProdutos).toHaveBeenCalledTimes(1);
  });

  it("deve ignorar resposta antiga quando uma busca mais recente terminar primeiro", async () => {
    const buscaAntiga = createDeferred<Produto[]>();

    const buscaRecente = createDeferred<Produto[]>();

    mockedFindAllProdutos
      .mockResolvedValueOnce([createProduto(1, "Produto inicial")])
      .mockImplementationOnce(() => buscaAntiga.promise)
      .mockImplementationOnce(() => buscaRecente.promise);

    renderProdutos();

    await screen.findByText("Produto inicial");

    fireEvent.change(screen.getByLabelText("Buscar produtos"), {
      target: {
        value: "mel",
      },
    });

    await waitFor(
      () => {
        expect(mockedFindAllProdutos).toHaveBeenCalledTimes(2);
      },
      {
        timeout: 1000,
      },
    );

    fireEvent.change(screen.getByLabelText("Buscar produtos"), {
      target: {
        value: "mel silvestre",
      },
    });

    await waitFor(
      () => {
        expect(mockedFindAllProdutos).toHaveBeenCalledTimes(3);
      },
      {
        timeout: 1000,
      },
    );

    await act(async () => {
      buscaRecente.resolve([createProduto(3, "Mel Silvestre recente")]);

      await buscaRecente.promise;
    });

    await screen.findByText("Mel Silvestre recente");

    await act(async () => {
      buscaAntiga.resolve([createProduto(2, "Resultado antigo")]);

      await buscaAntiga.promise;
    });

    expect(screen.getByText("Mel Silvestre recente")).toBeInTheDocument();

    expect(screen.queryByText("Resultado antigo")).not.toBeInTheDocument();
  });
});
