import { useEffect, useState, useRef } from 'react';
import { api, setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserRole } from '../utils/decodeToken';

interface Produto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  description?: string;
}

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        const conteudo = response.data.content || response.data;
        setProdutos(conteudo);
      } catch (error) {
        setErro('Erro ao carregar produtos. Verifique se está logado.');
      } finally {
        setCarregando(false);
      }
    };
    buscarProdutos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login');
  };

  const handleAddToCart = (produto: Produto) => {
    // Aqui você pode integrar com um contexto de carrinho ou toast
    alert(`🍯 ${produto.name} adicionado ao carrinho!`);
  };

  if (carregando) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin-slow text-8xl mb-4 drop-shadow-lg">🍯</div>
          <div className="absolute inset-0 animate-pulse-gentle rounded-full bg-amber-200/30 blur-xl"></div>
        </div>
        <p className="text-amber-700 dark:text-amber-400 text-xl font-medium mt-4">Carregando produtos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md">
          <p className="font-bold">⚠️ Ops!</p>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header sticky com glassmorphism */}
      <header className="bg-amber-800/90 dark:bg-amber-950/90 backdrop-blur-md text-white shadow-xl sticky top-0 z-20">
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <div className="animate-bounce-soft text-3xl">🍯</div>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight">APIÁRIO VITÓRIA SEVEN</h1>
    </div>
    <div className="flex items-center space-x-4">
      {getUserRole() === 'ADMIN' && (
        <Link to="/admin" className="bg-amber-700 hover:bg-amber-800 px-3 py-1 rounded-full text-sm transition">
          Admin
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="bg-amber-900/70 hover:bg-amber-900 text-white font-medium py-2 px-5 rounded-full transition flex items-center gap-2 backdrop-blur-sm border border-amber-600 hover:scale-105"
      >
        <span>🚪</span> Sair
      </button>
    </div>
  </div>
</header>

      {/* Hero com gradiente animado */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 animate-gradient-shift py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDYiIGQ9Ik0yMCA1IEw1IDE1IEw1IDI1IEwyMCAzNSBMMzUgMjUgTDM1IDE1IFoiLz48L3N2Zz4=')] bg-repeat opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block animate-bounce-soft text-7xl mb-4 drop-shadow-lg">🐝</div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md animate-fade-in-up">Doçura que vem da natureza</h2>
          <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto mt-4 animate-fade-in-up delay-200">
            Mel puro, própolis, geleia real – direto do Apiário Vitória Seven para sua casa.
          </p>
        </div>
      </section>

      {/* Listagem de produtos */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
          <h3 className="text-3xl font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 animate-fade-in-up">
            <span>🐝</span> Nossos Produtos
          </h3>
          <div className="bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium shadow-inner animate-fade-in-up delay-100">
            {produtos.length} itens disponíveis
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-16 bg-amber-50/50 dark:bg-gray-800/30 rounded-2xl backdrop-blur-sm animate-fade-in">
            <p className="text-amber-700 dark:text-amber-400 text-lg">Ainda não há produtos cadastrados. Volte em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produtos.map((produto, index) => (
              <div
                key={produto.id}
                ref={(el) => { productRefs.current[index] = el; }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-amber-200 dark:border-amber-700 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-gray-700 dark:to-amber-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                    <span className="text-7xl drop-shadow-md">🍯</span>
                  </div>
                  {produto.stockQuantity < 10 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      Últimas unidades
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-bold text-amber-800 dark:text-amber-400 line-clamp-1 group-hover:text-amber-600 transition">
                    {produto.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {produto.description || 'Produto natural de abelhas, rico em nutrientes e sabor incomparável.'}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                      R$ {produto.price.toFixed(2)}
                    </span>
                    {produto.price > 50 && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Frete grátis</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                    <span>📦</span> Estoque: {produto.stockQuantity} un.
                  </div>
                  <button
                    onClick={() => handleAddToCart(produto)}
                    className="mt-5 w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-2.5 rounded-xl transition transform active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>🛒</span> Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selos de qualidade */}
        <div className="mt-16 text-center text-sm text-amber-600 dark:text-amber-400 border-t border-amber-200 dark:border-amber-800 pt-8 flex justify-center gap-6 flex-wrap animate-fade-in-up delay-500">
          <span className="inline-flex items-center gap-1">✅ Produto 100% natural</span>
          <span className="inline-flex items-center gap-1">🐝 Apiário sustentável</span>
          <span className="inline-flex items-center gap-1">📦 Entrega rápida</span>
          <span className="inline-flex items-center gap-1">❤️ Feito com amor</span>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-amber-900 dark:bg-amber-950 text-amber-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Apiário Vitória Seven – Sabor que aquece o coração</p>
          <p className="mt-1 opacity-75">🌿 Mel puro – direto do apiário para sua mesa</p>
        </div>
      </footer>
    </div>
  );
}