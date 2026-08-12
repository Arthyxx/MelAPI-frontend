import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { AdminLayout } from './components/AdminLayout';
import { AdminRoute } from './components/AdminRoute';
import { useAuth } from './contexts/useAuth';

import { Cadastro } from './pages/Cadastro';
import { Carrinho } from './pages/Carrinho';
import { CategoriaProdutos } from './pages/CategoriaProdutos';
import { DetalhePedido } from './pages/DetalhePedido';
import { Login } from './pages/Login';
import { MeusPedidos } from './pages/MeusPedidos';
import { Perfil } from './pages/Perfil';
import { ProdutoDetalhe } from './pages/ProdutoDetalhe';
import { Produtos } from './pages/Produtos';

import { AdminDashboard } from './pages/AdminDashboard';
import { CategoriasAdmin } from './pages/admin/CategoriasAdmin';
import { ClientesAdmin } from './pages/admin/ClientesAdmin';
import { PedidosAdmin } from './pages/admin/PedidosAdmin';
import { ProdutosAdmin } from './pages/admin/ProdutosAdmin';

function App() {
  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    isAdmin
                      ? '/admin'
                      : '/produtos'
                  }
                  replace
                />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/cadastro"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    isAdmin
                      ? '/admin'
                      : '/produtos'
                  }
                  replace
                />
              ) : (
                <Cadastro />
              )
            }
          />

          <Route
            path="/produtos"
            element={<Produtos />}
          />

          <Route
            path="/produtos/:id"
            element={<ProdutoDetalhe />}
          />

          <Route
            path="/categorias/:id"
            element={
              <CategoriaProdutos />
            }
          />

          <Route
            path="/carrinho"
            element={
              isAuthenticated ? (
                <Carrinho />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />

          <Route
            path="/meus-pedidos"
            element={
              isAuthenticated ? (
                <MeusPedidos />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />

          <Route
            path="/meus-pedidos/:id"
            element={
              isAuthenticated ? (
                <DetalhePedido />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />

          <Route
            path="/perfil"
            element={
              isAuthenticated ? (
                <Perfil />
              ) : (
                <Navigate
                  to="/login"
                  replace
                />
              )
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to="/produtos"
                replace
              />
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout title="Dashboard">
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

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

          <Route
            path="*"
            element={
              <Navigate
                to="/produtos"
                replace
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
