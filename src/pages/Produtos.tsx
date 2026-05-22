import { useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/decodeToken';
import { addToCart, getCartItemsCount } from '../utils/cart';

interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  description?: string;
  active?: boolean;
}

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(getCartItemsCount());
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        setErro('');

        const response = await api.get('/produtos');
        const conteudo = response.data.content || response.data;

        setProdutos(Array.isArray(conteudo) ? conteudo : []);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setErro('Erro ao carregar produtos. Tente novamente em instantes.');
      } finally {
        setCarregando(false);
      }
    };

    buscarProdutos();
  }, []);

  useEffect(() => {
    const atualizarEstadoLogin = () => {
      setIsLogged(!!localStorage.getItem('token'));
      setCartItemsCount(getCartItemsCount());
    };

    window.addEventListener('storage', atualizarEstadoLogin);

    return () => {
      window.removeEventListener('storage', atualizarEstadoLogin);
    };
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return produtos;
    }

    return produtos.filter((produto) => {
      const nome = produto.name?.toLowerCase() || '';
      const descricao = produto.description?.toLowerCase() || '';

      return nome.includes(termo) || descricao.includes(termo);
    });
  }, [produtos, busca]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    setAuthToken(null);
    setIsLogged(false);
    setCartItemsCount(0);
    setMenuOpen(false);

    navigate('/produtos');
  };

  const handleAddToCart = (produto: Produto) => {
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

  const formatCurrency = (value?: number | null) => {
    return Number(value ?? 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (carregando) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="relative">
          <div className="mb-4 text-8xl drop-shadow-lg animate-spin-slow">
            🍯
          </div>
          <div className="absolute inset-0 rounded-full bg-amber-200/30 blur-xl animate-pulse-gentle" />
        </div>

        <p className="mt-4 text-xl font-bold text-amber-700 dark:text-amber-300">
          Carregando produtos...
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl dark:border-red-900 dark:bg-gray-900">
          <div className="mb-4 text-6xl">⚠️</div>

          <h2 className="text-2xl font-black text-red-700 dark:text-red-300">
            Ops!
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">{erro}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <header className="sticky top-0 z-30 border-b border-amber-300/40 bg-amber-950/90 text-white shadow-xl backdrop-blur-md dark:bg-gray-950/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/produtos" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-inner animate-bounce-soft">
                <span className="text-3xl">🍯</span>
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight md:text-2xl">
                  Apiário Vitória Seven
                </h1>
                <p className="text-xs text-amber-100 md:text-sm">
                  Mel puro, própolis e produtos naturais
                </p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2">
              {!isLogged ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
                  >
                    <span>🔐</span>
                    Entrar
                  </Link>

                  <Link
                    to="/cadastro"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 text-sm font-black text-amber-950 shadow-lg transition hover:-translate-y-0.5 hover:from-yellow-300 hover:to-amber-400 hover:shadow-xl"
                  >
                    <span>✨</span>
                    Cadastrar
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-xl"
                  aria-label="Abrir menu"
                >
                  <span className="flex flex-col gap-1.5">
                    <span className="block h-0.5 w-6 rounded-full bg-white" />
                    <span className="block h-0.5 w-6 rounded-full bg-white" />
                    <span className="block h-0.5 w-6 rounded-full bg-white" />
                  </span>

                  {cartItemsCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-md">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {isLogged && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setMenuOpen(false)}
          />

          <aside
            className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm transform border-l border-amber-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-amber-900 dark:bg-gray-950 ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-4xl shadow-inner">
                      🍯
                    </div>

                    <h2 className="mt-4 text-2xl font-black">
                      Minha conta
                    </h2>

                    <p className="mt-1 text-sm text-amber-100">
                      Gerencie suas compras e pedidos
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl font-black transition hover:bg-white/25"
                    aria-label="Fechar menu"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 shadow-sm dark:border-amber-900 dark:from-gray-900 dark:to-amber-950/30">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-gray-950">
                      👤
                    </div>

                    <div>
                      <p className="font-black text-amber-950 dark:text-amber-300">
                        Perfil
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Dados da conta e preferências
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/carrinho"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-100 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm dark:bg-gray-950">
                      🛒
                    </div>

                    <div>
                      <p className="font-black text-amber-950 dark:text-amber-300">
                        Carrinho
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cartItemsCount}{' '}
                        {cartItemsCount === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/meus-pedidos"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm dark:bg-amber-950">
                      📦
                    </div>

                    <div>
                      <p className="font-black text-amber-950 dark:text-amber-300">
                        Meus pedidos
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Acompanhe suas compras
                      </p>
                    </div>
                  </div>

                  <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/produtos"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm dark:bg-amber-950">
                      🍯
                    </div>

                    <div>
                      <p className="font-black text-amber-950 dark:text-amber-300">
                        Produtos
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Voltar para a loja
                      </p>
                    </div>
                  </div>

                  <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                {role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm dark:bg-amber-950">
                        ⚙️
                      </div>

                      <div>
                        <p className="font-black text-amber-950 dark:text-amber-300">
                          Painel admin
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Gerenciar loja
                        </p>
                      </div>
                    </div>

                    <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                )}
              </div>

              <div className="border-t border-amber-100 p-5 dark:border-amber-900">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-red-600 hover:shadow-xl"
                >
                  <span>🚪</span>
                  Sair da conta
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      <section className="relative overflow-hidden border-b border-amber-200/60 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 py-24 text-white shadow-xl animate-gradient-shift dark:border-amber-900">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl animate-pulse-gentle" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl animate-pulse-gentle" />
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl animate-spin-slow" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/15 text-6xl shadow-inner backdrop-blur-md">
            🍯
          </div>

          <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-50 shadow-sm backdrop-blur-md">
            Loja oficial do apiário
          </span>

          <h2 className="mx-auto mt-5 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            Mel puro e produtos naturais direto do produtor
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-amber-50 md:text-lg">
            Uma loja feita para vender produtos de mel com apresentação
            profissional, vitrine pública e compra segura para clientes
            cadastrados.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar mel, própolis, geleia real..."
                className="w-full rounded-2xl border border-white/20 bg-white/95 px-12 py-4 font-medium text-gray-900 shadow-xl outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-white/30"
              />
            </div>

            {!isLogged && (
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-950 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-amber-900 hover:shadow-2xl"
              >
                Criar conta
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-amber-200/60 bg-white/70 py-8 backdrop-blur-md dark:border-amber-900 dark:bg-gray-950/70">
        <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
          <div className="animate-fade-in-up rounded-3xl border border-amber-200 bg-white p-5 shadow-md dark:border-amber-800 dark:bg-gray-900">
            <div className="text-3xl">🐝</div>
            <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
              Direto do apiário
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Produtos selecionados com foco em qualidade e origem.
            </p>
          </div>

          <div className="animate-fade-in-up delay-100 rounded-3xl border border-amber-200 bg-white p-5 shadow-md dark:border-amber-800 dark:bg-gray-900">
            <div className="text-3xl">📦</div>
            <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
              Pedido acompanhado
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Cliente acompanha status e detalhes dos pedidos.
            </p>
          </div>

          <div className="animate-fade-in-up delay-200 rounded-3xl border border-amber-200 bg-white p-5 shadow-md dark:border-amber-800 dark:bg-gray-900">
            <div className="text-3xl">🍯</div>
            <h3 className="mt-3 font-black text-amber-900 dark:text-amber-300">
              Compra simples
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Vitrine pública, carrinho e finalização para clientes logados.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800">
              Produtos em destaque
            </span>

            <h3 className="mt-3 text-3xl font-black text-amber-950 dark:text-amber-300">
              Nossa seleção
            </h3>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {produtosFiltrados.length}{' '}
              {produtosFiltrados.length === 1
                ? 'produto encontrado'
                : 'produtos encontrados'}
            </p>
          </div>

          {!isLogged && (
            <div className="rounded-2xl border border-amber-200 bg-white/80 px-5 py-4 text-sm text-amber-900 shadow-sm backdrop-blur-md dark:border-amber-800 dark:bg-gray-900/80 dark:text-amber-200">
              <strong>Quer comprar?</strong> Entre ou cadastre-se para adicionar
              produtos ao carrinho.
            </div>
          )}
        </div>

        {produtosFiltrados.length === 0 ? (
          <section className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-10 text-center shadow-2xl dark:border-amber-800 dark:bg-gray-900">
            <div className="mb-4 text-7xl">🍯</div>

            <h3 className="text-2xl font-black text-amber-900 dark:text-amber-300">
              Nenhum produto encontrado
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Tente buscar por outro nome ou limpe o campo de pesquisa.
            </p>

            <button
              type="button"
              onClick={() => setBusca('')}
              className="mt-6 rounded-2xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-amber-700 hover:shadow-xl"
            >
              Limpar busca
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {produtosFiltrados.map((produto, index) => {
              const semEstoque = produto.stockQuantity <= 0;

              return (
                <article
                  key={produto.id}
                  className="group animate-fade-in-up overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-amber-800 dark:bg-gray-900"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-950 dark:via-gray-800 dark:to-gray-900">
                    {produto.imageUrl ? (
                      <img
                        src={produto.imageUrl}
                        alt={produto.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="relative">
                        <span className="text-8xl drop-shadow-md transition duration-500 group-hover:scale-110">
                          🍯
                        </span>
                        <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-2xl animate-pulse-gentle" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-amber-900 shadow-md backdrop-blur-md">
                      Artesanal
                    </span>

                    {semEstoque && (
                      <span className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white shadow-md">
                        Sem estoque
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-xl font-black text-amber-950 dark:text-amber-300">
                        {produto.name}
                      </h4>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {produto.description ||
                          'Produto artesanal selecionado do Apiário Vitória Seven.'}
                      </p>
                    </div>

                    <div className="mb-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        🐝 Natural
                      </span>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        Estoque: {produto.stockQuantity}
                      </span>
                    </div>

                    <div className="mb-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Preço
                        </p>

                        <p className="text-3xl font-black text-amber-700 dark:text-amber-300">
                          {formatCurrency(produto.price)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right dark:bg-amber-950/40">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                          Qualidade
                        </p>
                        <p className="text-sm font-black text-amber-950 dark:text-amber-200">
                          Premium
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(produto)}
                      disabled={semEstoque}
                      className={`group/btn relative w-full overflow-hidden rounded-2xl px-5 py-4 font-black shadow-lg transition duration-300 ${
                        semEstoque
                          ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          : isLogged
                            ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white hover:-translate-y-1 hover:shadow-2xl'
                            : 'bg-gradient-to-r from-amber-950 to-amber-800 text-white hover:-translate-y-1 hover:shadow-2xl'
                      }`}
                    >
                      {!semEstoque && (
                        <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition duration-700 group-hover/btn:translate-x-[100%]" />
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
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <section className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-950 py-16 text-white">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl animate-pulse-gentle" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl animate-pulse-gentle" />

        <div className="container relative z-10 mx-auto grid gap-8 px-4 lg:grid-cols-[1fr_0.75fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-50">
              Produtos naturais
            </span>

            <h3 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
              Uma loja digital para valorizar o mel artesanal.
            </h3>

            <p className="mt-4 max-w-2xl text-amber-100">
              O Apiário Vitória Seven reúne produtos naturais com uma
              experiência simples, bonita e confiável para clientes comprarem e
              acompanharem seus pedidos.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
            <div className="text-6xl">🍯</div>

            <h4 className="mt-4 text-2xl font-black">
              Mel com identidade profissional
            </h4>

            <p className="mt-2 text-sm text-amber-100">
              Vitrine moderna, carrinho, pedidos e painel administrativo para
              gerenciar a loja.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-amber-800 bg-amber-950 text-amber-50">
        <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-3xl shadow-inner">
                🍯
              </div>

              <div>
                <h3 className="text-xl font-black">
                  Apiário Vitória Seven
                </h3>
                <p className="text-sm text-amber-200">
                  Produtos naturais e artesanais
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-amber-100">
              Loja especializada em produtos de mel, criada para oferecer uma
              experiência moderna, simples e confiável para clientes que procuram
              produtos naturais.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
                🐝 Natural
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
                🍯 Artesanal
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
                📦 Pedidos online
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-black text-white">Loja</h4>

            <ul className="mt-4 space-y-3 text-sm text-amber-100">
              <li>
                <Link to="/produtos" className="transition hover:text-white">
                  Produtos
                </Link>
              </li>

              <li>
                <Link to="/carrinho" className="transition hover:text-white">
                  Carrinho
                </Link>
              </li>

              <li>
                <Link to="/meus-pedidos" className="transition hover:text-white">
                  Meus pedidos
                </Link>
              </li>

              {!isLogged && (
                <li>
                  <Link to="/login" className="transition hover:text-white">
                    Entrar
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white">Atendimento</h4>

            <ul className="mt-4 space-y-3 text-sm text-amber-100">
              <li>📍 Fortaleza - CE</li>
              <li>📦 Entrega a combinar</li>
              <li>💬 Atendimento pelo vendedor</li>
              <li>🔒 Compra com login seguro</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-5">
          <div className="container mx-auto flex flex-col gap-3 text-sm text-amber-200 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Apiário Vitória Seven. Todos os
              direitos reservados.
            </p>

            <p>Desenvolvido com React + NestJS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}