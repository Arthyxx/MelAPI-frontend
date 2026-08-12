import type { ReactNode } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const navItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: '📊',
  },
  {
    path: '/admin/produtos',
    label: 'Produtos',
    icon: '📦',
  },
  {
    path: '/admin/categorias',
    label: 'Categorias',
    icon: '🏷️',
  },
  {
    path: '/admin/clientes',
    label: 'Clientes',
    icon: '👥',
  },
  {
    path: '/admin/pedidos',
    label: 'Pedidos',
    icon: '📋',
  },
];

export function AdminLayout({
  children,
  title,
}: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();

    navigate('/login', {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-amber-200 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              🍯
            </span>

            <h1 className="text-xl font-bold text-amber-800">
              Apiário Vitória Seven
            </h1>

            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="hidden text-sm text-gray-500 md:inline">
                {user.email}
              </span>
            )}

            <Link
              to="/produtos"
              className="flex items-center gap-1 text-amber-600 transition hover:text-amber-800"
            >
              <span>🛍️</span>
              Ir para a loja
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="min-h-[calc(100vh-57px)] w-64 border-r border-amber-100 bg-white p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname ===
                item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2 transition ${
                    isActive
                      ? 'bg-amber-100 font-medium text-amber-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">
                    {item.icon}
                  </span>

                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="rounded-xl border border-amber-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-amber-800">
              {title}
            </h2>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
