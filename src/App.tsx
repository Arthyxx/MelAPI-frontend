import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Produtos } from './pages/Produtos';
import { setAuthToken } from './services/api';
import { useEffect, useState } from 'react';
import { AdminRoute } from './components/AdminRoute';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função para atualizar o estado baseado no token
  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) setAuthToken(token);
  };

  useEffect(() => {
    updateAuthState();
    setLoading(false);
  }, []);

  // Observa mudanças no localStorage (outras abas ou chamadas manuais)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        updateAuthState();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Intercepta chamadas diretas a localStorage.setItem
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
          <Route path="/produtos" element={isAuthenticated ? <Produtos /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/produtos" />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;