import {
  useEffect,
  useState,
} from 'react';

import {
  findAllCategorias,
  findCategoriaById,
} from '../../services/categoriaService';
import {
  findAllProdutos,
} from '../../services/produtoService';

import type {
  Categoria,
} from '../../types/categoria';
import type {
  Produto,
} from '../../types/produto';

interface UseCategoriaProdutosOptions {
  id?: string;
}

export function useCategoriaProdutos({
  id,
}: UseCategoriaProdutosOptions) {
  const [produtos, setProdutos] =
    useState<Produto[]>([]);

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [categoria, setCategoria] =
    useState<Categoria | null>(null);

  const [
    primeiroCarregamento,
    setPrimeiroCarregamento,
  ] = useState(true);

  const [filtrando, setFiltrando] =
    useState(false);

  const [erro, setErro] =
    useState('');

  const [busca, setBusca] =
    useState('');

  const [
    somenteDisponiveis,
    setSomenteDisponiveis,
  ] = useState(false);

  const [ordenacao, setOrdenacao] =
    useState('');

  const hasFilters = Boolean(
    busca ||
      ordenacao ||
      somenteDisponiveis,
  );

  useEffect(() => {
    const buscarCategorias =
      async () => {
        try {
          const categoriasData =
            await findAllCategorias();

          setCategorias(
            categoriasData,
          );
        } catch (error) {
          console.error(
            'Erro ao carregar categorias:',
            error,
          );
        }
      };

    void buscarCategorias();
  }, []);

  useEffect(() => {
    const buscarCategoria =
      async () => {
        if (!id) {
          setErro(
            'Categoria não encontrada.',
          );

          setPrimeiroCarregamento(
            false,
          );

          return;
        }

        try {
          const categoriaData =
            await findCategoriaById(
              id,
            );

          setCategoria(
            categoriaData,
          );
        } catch (error) {
          console.error(
            'Erro ao carregar categoria:',
            error,
          );

          setErro(
            'Categoria não encontrada.',
          );
        }
      };

    void buscarCategoria();
  }, [id]);

  useEffect(() => {
    const buscarProdutos =
      async () => {
        if (!id) {
          setPrimeiroCarregamento(
            false,
          );

          return;
        }

        const categoryId =
          Number(id);

        if (
          !Number.isInteger(
            categoryId,
          ) ||
          categoryId <= 0
        ) {
          setErro(
            'Categoria não encontrada.',
          );

          setPrimeiroCarregamento(
            false,
          );

          return;
        }

        try {
          setErro('');

          if (
            !primeiroCarregamento
          ) {
            setFiltrando(true);
          }

          const produtosData =
            await findAllProdutos({
              name: busca,
              categoryId,
              active: true,
              sort:
                ordenacao ||
                undefined,
            });

          const produtosFiltrados =
            somenteDisponiveis
              ? produtosData.filter(
                  (produto) =>
                    produto.stockQuantity >
                    0,
                )
              : produtosData;

          setProdutos(
            produtosFiltrados,
          );
        } catch (error) {
          console.error(
            'Erro ao carregar produtos da categoria:',
            error,
          );

          setErro(
            'Erro ao carregar produtos desta categoria.',
          );
        } finally {
          setPrimeiroCarregamento(
            false,
          );

          setFiltrando(false);
        }
      };

    const timeoutId =
      window.setTimeout(
        () => {
          void buscarProdutos();
        },
        primeiroCarregamento
          ? 0
          : 350,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    id,
    busca,
    somenteDisponiveis,
    ordenacao,
    primeiroCarregamento,
  ]);

  const clearFilters = () => {
    setBusca('');
    setOrdenacao('');
    setSomenteDisponiveis(
      false,
    );
  };

  const toggleSomenteDisponiveis =
    () => {
      setSomenteDisponiveis(
        (previousValue) =>
          !previousValue,
      );
    };

  return {
    produtos,
    categorias,
    categoria,

    primeiroCarregamento,
    filtrando,
    erro,

    busca,
    ordenacao,
    somenteDisponiveis,
    hasFilters,

    setBusca,
    setOrdenacao,
    toggleSomenteDisponiveis,
    clearFilters,
  };
}