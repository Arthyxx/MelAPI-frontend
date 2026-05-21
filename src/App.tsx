import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Produtos } from './pages/Produtos';
import { setAuthToken } from './services/api';
import { useEffect, useState } from 'react';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/AdminLayout';

import { ProdutosAdmin } from './pages/admin/ProdutosAdmin';
import { CategoriasAdmin } from './pages/admin/CategoriasAdmin';
import { ClientesAdmin } from './pages/admin/ClientesAdmin';
import { PedidosAdmin } from './pages/admin/PedidosAdmin';
import { Cadastro } from './pages/Cadastro';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token) {
      setAuthToken(token);
    }
  };

  useEffect(() => {
    updateAuthState();
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key: string, value: string) {
      originalSetItem.call(this, key, value);

      if (key === 'token') {
        updateAuthState();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-600 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/produtos"
            element={isAuthenticated ? <Produtos /> : <Navigate to="/login" />}
          />

          <Route path="/" element={<Navigate to="/produtos" />} />

          <Route path="/admin" element={<Navigate to="/admin/produtos" />} />

          <Route
            path="/admin/produtos"
            element={
              <AdminRoute>
                <AdminLayout title="Produtos">
                  <ProdutosAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categorias"
            element={
              <AdminRoute>
                <AdminLayout title="Categorias">
                  <CategoriasAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/clientes"
            element={
              <AdminRoute>
                <AdminLayout title="Clientes">
                  <ClientesAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/pedidos"
            element={
              <AdminRoute>
                <AdminLayout title="Pedidos">
                  <PedidosAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;