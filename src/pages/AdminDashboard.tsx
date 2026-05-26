import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProdutosAdmin } from './admin/ProdutosAdmin';
import { CategoriasAdmin } from './admin/CategoriasAdmin';
import { ClientesAdmin } from './admin/ClientesAdmin';
import { PedidosAdmin } from './admin/PedidosAdmin';

type AdminTabId = 'produtos' | 'categorias' | 'clientes' | 'pedidos';

const tabs = [
  {
    id: 'produtos',
    label: 'Produtos',
    description: 'Gerencie vitrine, estoque e preços',
    icon: '🍯',
    component: <ProdutosAdmin />,
  },
  {
    id: 'categorias',
    label: 'Categorias',
    description: 'Organize os tipos de produtos',
    icon: '🏷️',
    component: <CategoriasAdmin />,
  },
  {
    id: 'clientes',
    label: 'Clientes',
    description: 'Controle usuários e permissões',
    icon: '👥',
    component: <ClientesAdmin />,
  },
  {
    id: 'pedidos',
    label: 'Pedidos',
    description: 'Acompanhe compras e entregas',
    icon: '📦',
    component: <PedidosAdmin />,
  },
] as const;

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabId>('produtos');

  const currentTab = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab) || tabs[0];
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-3xl shadow-inner">
              🍯
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-black tracking-tight text-gray-950">
                  Apiário Vitória Seven
                </h1>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-700">
                  Admin
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Painel de gerenciamento da loja
              </p>
            </div>
          </div>

          <Link
            to="/produtos"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
          >
            <span>←</span>
            Voltar à loja
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8 rounded-[2rem] border border-gray-100 bg-gray-50 p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-700">
                Administração
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
                {currentTab.label}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {currentTab.description}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group rounded-3xl border p-4 text-left transition ${
                    active
                      ? 'border-amber-200 bg-white shadow-md ring-4 ring-amber-100'
                      : 'border-gray-100 bg-white/70 hover:-translate-y-0.5 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl transition ${
                        active
                          ? 'bg-amber-100'
                          : 'bg-gray-100 group-hover:bg-amber-50'
                      }`}
                    >
                      {tab.icon}
                    </div>

                    <div>
                      <h3
                        className={`font-black ${
                          active ? 'text-amber-800' : 'text-gray-900'
                        }`}
                      >
                        {tab.label}
                      </h3>

                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          {currentTab.component}
        </section>
      </main>
    </div>
  );
}