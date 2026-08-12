import {
  act,
  renderHook,
} from '@testing-library/react';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import type { ReactNode } from 'react';

import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';

const setAuthTokenMock = vi.fn();

vi.mock('../services/api', () => ({
  setAuthToken: (
    token: string | null,
  ) => setAuthTokenMock(token),
}));

function toBase64Url(
  value: string,
): string {
  return btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createTestToken({
  sub = 1,
  email = 'cliente@email.com',
  role = 'CLIENTE',
  expiresInSeconds = 3600,
}: {
  sub?: number;
  email?: string;
  role?: 'ADMIN' | 'CLIENTE';
  expiresInSeconds?: number;
} = {}) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub,
    email,
    role,
    exp:
      Math.floor(
        Date.now() / 1000,
      ) + expiresInSeconds,
  };

  return [
    toBase64Url(
      JSON.stringify(header),
    ),
    toBase64Url(
      JSON.stringify(payload),
    ),
    'assinatura-ficticia',
  ].join('.');
}

function wrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    setAuthTokenMock.mockClear();
  });

  it('deve iniciar sem usuário quando não existe token salvo', () => {
    const { result } = renderHook(
      () => useAuth(),
      { wrapper },
    );

    expect(
      result.current.isAuthenticated,
    ).toBe(false);

    expect(
      result.current.user,
    ).toBeNull();

    expect(
      result.current.token,
    ).toBeNull();

    expect(
      result.current.isAdmin,
    ).toBe(false);
  });

  it('deve autenticar um cliente com token válido', () => {
    const token =
      createTestToken({
        sub: 10,
        email:
          'cliente10@email.com',
        role: 'CLIENTE',
      });

    const { result } = renderHook(
      () => useAuth(),
      { wrapper },
    );

    act(() => {
      result.current.signIn(token);
    });

    expect(
      result.current.isAuthenticated,
    ).toBe(true);

    expect(
      result.current.user,
    ).toEqual({
      id: 10,
      email:
        'cliente10@email.com',
      role: 'CLIENTE',
    });

    expect(
      result.current.isAdmin,
    ).toBe(false);

    expect(
      localStorage.getItem('token'),
    ).toBe(token);

    expect(
      localStorage.getItem('role'),
    ).toBe('CLIENTE');
  });

  it('deve identificar corretamente um administrador', () => {
    const token =
      createTestToken({
        sub: 2,
        email:
          'admin@email.com',
        role: 'ADMIN',
      });

    const { result } = renderHook(
      () => useAuth(),
      { wrapper },
    );

    act(() => {
      result.current.signIn(token);
    });

    expect(
      result.current.isAuthenticated,
    ).toBe(true);

    expect(
      result.current.isAdmin,
    ).toBe(true);

    expect(
      result.current.user?.role,
    ).toBe('ADMIN');
  });

  it('deve restaurar uma sessão válida salva no localStorage', () => {
    const token =
      createTestToken({
        sub: 25,
        email:
          'cliente25@email.com',
      });

    localStorage.setItem(
      'token',
      token,
    );

    const { result } = renderHook(
      () => useAuth(),
      { wrapper },
    );

    expect(
      result.current.isAuthenticated,
    ).toBe(true);

    expect(
      result.current.user?.id,
    ).toBe(25);

    expect(
      result.current.token,
    ).toBe(token);
  });

  it('deve remover token expirado ao iniciar', () => {
    const token =
      createTestToken({
        expiresInSeconds: -60,
      });

    localStorage.setItem(
      'token',
      token,
    );

    localStorage.setItem(
      'role',
      'CLIENTE',
    );

    const { result } = renderHook(
      () => useAuth(),
      { wrapper },
    );

    expect(
      result.current.isAuthenticated,
    ).toBe(false);

    expect(
      result.current.user,
    ).toBeNull();

    expect(
      localStorage.getItem('token'),
    ).toBeNull();

    expect(
      localStorage.getItem('role'),
    ).toBeNull();
  });

  it('deve encerrar a sessão ao executar signOut', () => {
    const token =
      createTestToken();

    const { result } = renderHook(
      () => useAuth(),
      { wrapper },
    );

    act(() => {
      result.current.signIn(token);
    });

    expect(
      result.current.isAuthenticated,
    ).toBe(true);

    act(() => {
      result.current.signOut();
    });

    expect(
      result.current.isAuthenticated,
    ).toBe(false);

    expect(
      result.current.user,
    ).toBeNull();

    expect(
      localStorage.getItem('token'),
    ).toBeNull();
  });

  it('deve encerrar a sessão ao receber auth:unauthorized', () => {
    const token =
      createTestToken();

    const { result } = renderHook(
      () => useAuth(),
      { wrapper },
    );

    act(() => {
      result.current.signIn(token);
    });

    expect(
      result.current.isAuthenticated,
    ).toBe(true);

    act(() => {
      window.dispatchEvent(
        new Event(
          'auth:unauthorized',
        ),
      );
    });

    expect(
      result.current.isAuthenticated,
    ).toBe(false);

    expect(
      result.current.user,
    ).toBeNull();

    expect(
      localStorage.getItem('token'),
    ).toBeNull();
  });
});