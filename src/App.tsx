import {
  lazy,
  Suspense,
} from 'react';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import {
  AdminLayout,
} from './components/AdminLayout';
import {
  AdminRoute,
} from './components/AdminRoute';
import {
  useAuth,
} from './contexts/useAuth';

const Cadastro = lazy(() =>
  import('./pages/Cadastro').then(
    (module) => ({
      default: module.Cadastro,
    }),
  ),
);

const Carrinho = lazy(() =>
  import('./pages/Carrinho').then(
    (module) => ({
      default: module.Carrinho,
    }),
  ),
);

const CategoriaProdutos = lazy(() =>
  import(
    './pages/CategoriaProdutos'
  ).then((module) => ({
    default:
      module.CategoriaProdutos,
  })),
);

const DetalhePedido = lazy(() =>
  import(
    './pages/DetalhePedido'
  ).then((module) => ({
    default:
      module.DetalhePedido,
  })),
);

const Login = lazy(() =>
  import('./pages/Login').then(
    (module) => ({
      default: module.Login,
    }),
  ),
);

const MeusPedidos = lazy(() =>
  import(
    './pages/MeusPedidos'
  ).then((module) => ({
    default: module.MeusPedidos,
  })),
);

const Perfil = lazy(() =>
  import('./pages/Perfil').then(
    (module) => ({
      default: module.Perfil,
    }),
  ),
);

const ProdutoDetalhe = lazy(() =>
  import(
    './pages/ProdutoDetalhe'
  ).then((module) => ({
    default:
      module.ProdutoDetalhe,
  })),
);

const Produtos = lazy(() =>
  import('./pages/Produtos').then(
    (module) => ({
      default: module.Produtos,
    }),
  ),
);

const AdminDashboard = lazy(() =>
  import(
    './pages/AdminDashboard'
  ).then((module) => ({
    default:
      module.AdminDashboard,
  })),
);

const CategoriasAdmin = lazy(() =>
  import(
    './pages/admin/CategoriasAdmin'
  ).then((module) => ({
    default:
      module.CategoriasAdmin,
  })),
);

const ClientesAdmin = lazy(() =>
  import(
    './pages/admin/ClientesAdmin'
  ).then((module) => ({
    default:
      module.ClientesAdmin,
  })),
);

const PedidosAdmin = lazy(() =>
  import(
    './pages/admin/PedidosAdmin'
  ).then((module) => ({
    default:
      module.PedidosAdmin,
  })),
);

const ProdutosAdmin = lazy(() =>
  import(
    './pages/admin/ProdutosAdmin'
  ).then((module) => ({
    default:
      module.ProdutosAdmin,
  })),
);

function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

        <p className="mt-4 font-semibold text-amber-800 dark:text-amber-300">
          Carregando...
        </p>
      </div>
    </div>
  );
}

function App() {
  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950">
        <Suspense
          fallback={
            <RouteLoading />
          }
        >
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
              element={
                <Produtos />
              }
            />

            <Route
              path="/produtos/:id"
              element={
                <ProdutoDetalhe />
              }
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
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;