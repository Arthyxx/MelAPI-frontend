import { useState } from 'react';
import { ProdutosAdmin } from './admin/ProdutosAdmin';
import { CategoriasAdmin } from './admin/CategoriasAdmin';
import { ClientesAdmin } from './admin/ClientesAdmin';
import { PedidosAdmin } from './admin/PedidosAdmin';

const tabs = [
  { id: 'produtos', label: 'Produtos', component: <ProdutosAdmin /> },
  { id: 'categorias', label: 'Categorias', component: <CategoriasAdmin /> },
  { id: 'clientes', label: 'Clientes', component: <ClientesAdmin /> },
  { id: 'pedidos', label: 'Pedidos', component: <PedidosAdmin /> },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('produtos');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho claro */}
      <div className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍯</span>
            <h1 className="text-xl font-bold text-amber-800">Apiário Vitória Seven</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Administração</span>
          </div>
          <a href="/produtos" className="text-amber-600 hover:text-amber-800 text-sm">← Voltar à loja</a>
        </div>
      </div>

      {/* Abas */}
      <div className="container mx-auto px-4 py-6">
        <div className="border-b border-amber-200 mb-6">
          <ul className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-t-lg transition ${
                    activeTab === tab.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Conteúdo da aba ativa */}
        <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
          {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}