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
    label: 'Visão geral',
    description:
      'Resumo da loja',
    icon: '📊',
  },
  {
    path: '/admin/produtos',
    label: 'Produtos',
    description:
      'Preço, estoque e fotos',
    icon: '📦',
  },
  {
    path: '/admin/categorias',
    label: 'Categorias',
    description:
      'Organização dos produtos',
    icon: '🏷️',
  },
  {
    path: '/admin/clientes',
    label: 'Clientes',
    description:
      'Contas cadastradas',
    icon: '👥',
  },
  {
    path: '/admin/pedidos',
    label: 'Pedidos',
    description:
      'Acompanhar as vendas',
    icon: '📋',
  },
];

export function AdminLayout({
  children,
  title,
}: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    signOut,
  } = useAuth();

  const handleSignOut = () => {
    signOut();

    navigate('/login', {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 border-b border-amber-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/admin"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
              🍯
            </div>

            <div className="min-w-0">
              <p className="truncate font-black text-amber-900">
                Apiário Vitória Seven
              </p>

              <p className="text-xs font-bold text-gray-500">
                Painel administrativo
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {user?.email && (
              <div className="hidden text-right lg:block">
                <p className="text-xs font-bold text-gray-400">
                  Administrador
                </p>

                <p className="max-w-52 truncate text-sm font-semibold text-gray-600">
                  {user.email}
                </p>
              </div>
            )}

            <Link
              to="/produtos"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-black text-amber-800 transition hover:bg-amber-100"
            >
              <span>🛍️</span>

              <span className="hidden sm:inline">
                Ver loja
              </span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="h-10 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-black text-red-700 transition hover:bg-red-100"
            >
              Sair
            </button>
          </div>
        </div>

        <nav className="border-t border-gray-100 bg-white lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {navItems.map(
              (item) => {
                const isActive =
                  location.pathname ===
                  item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={
                      isActive
                        ? 'page'
                        : undefined
                    }
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${
                      isActive
                        ? 'bg-amber-700 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>
                      {item.icon}
                    </span>

                    {item.label}
                  </Link>
                );
              },
            )}
          </div>
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-72 shrink-0 border-r border-gray-200 bg-white p-4 lg:block">
          <div className="mb-4 px-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
              Administração
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map(
              (item) => {
                const isActive =
                  location.pathname ===
                  item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={
                      isActive
                        ? 'page'
                        : undefined
                    }
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                      isActive
                        ? 'bg-amber-100 text-amber-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                        isActive
                          ? 'bg-white'
                          : 'bg-gray-50'
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="font-black">
                        {item.label}
                      </p>

                      <p
                        className={`truncate text-xs ${
                          isActive
                            ? 'text-amber-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {
                          item.description
                        }
                      </p>
                    </div>
                  </Link>
                );
              },
            )}
          </nav>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-black text-blue-900">
              💡 Dica
            </p>

            <p className="mt-1 text-xs leading-relaxed text-blue-700">
              Use este painel para
              acompanhar pedidos,
              produtos, estoque,
              categorias e clientes
              da loja.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">
              Painel administrativo
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
              {title}
            </h1>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}