import {
  render,
  screen,
} from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { AdminRoute } from './AdminRoute';

const useAuthMock = vi.fn();

vi.mock(
  '../contexts/useAuth',
  () => ({
    useAuth: () =>
      useAuthMock(),
  }),
);

function renderAdminRoute() {
  return render(
    <MemoryRouter
      initialEntries={['/admin']}
    >
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <div>
                Painel administrativo
              </div>
            </AdminRoute>
          }
        />

        <Route
          path="/login"
          element={
            <div>
              Tela de login
            </div>
          }
        />

        <Route
          path="/produtos"
          element={
            <div>
              Lista de produtos
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AdminRoute', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('deve redirecionar usuário não autenticado para o login', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    });

    renderAdminRoute();

    expect(
      screen.getByText(
        'Tela de login',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'Painel administrativo',
      ),
    ).not.toBeInTheDocument();
  });

  it('deve redirecionar cliente autenticado para produtos', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
    });

    renderAdminRoute();

    expect(
      screen.getByText(
        'Lista de produtos',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'Painel administrativo',
      ),
    ).not.toBeInTheDocument();
  });

  it('deve permitir acesso para administrador autenticado', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    });

    renderAdminRoute();

    expect(
      screen.getByText(
        'Painel administrativo',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'Tela de login',
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'Lista de produtos',
      ),
    ).not.toBeInTheDocument();
  });
});