import { Link, useLocation } from 'react-router-dom';
import { getUserRole } from '../utils/decodeToken';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();
  const role = getUserRole();

  // Só permite acesso se for ADMIN (redundante, mas seguro)
  if (role !== 'ADMIN') return null;

  const navItems = [
    { path: '/admin/produtos', label: 'Produtos', icon: '📦' },
    { path: '/admin/categorias', label: 'Categorias', icon: '🏷️' },
    { path: '/admin/clientes', label: 'Clientes', icon: '👥' },
    { path: '/admin/pedidos', label: 'Pedidos', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho do admin */}
      <header className="bg-white border-b border-amber-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍯</span>
            <h1 className="text-xl font-bold text-amber-800">Apiário Vitória Seven</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Admin</span>
          </div>
          <Link
            to="/produtos"
            className="text-amber-600 hover:text-amber-800 transition flex items-center gap-1"
          >
            <span>🏠</span> Ir para a loja
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-amber-100 min-h-[calc(100vh-56px)] p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-amber-100 text-amber-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">{title}</h2>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}