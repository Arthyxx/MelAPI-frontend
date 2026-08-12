import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { setAuthToken } from '../services/api';
import {
  decodeToken,
  type TokenPayload,
} from '../utils/decodeToken';
import {
  AuthContext,
  type AuthContextData,
  type AuthUser,
} from './auth-context';

interface AuthSession {
  token: string | null;
  user: AuthUser | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

function clearStoredSession(): AuthSession {
  localStorage.removeItem('token');
  localStorage.removeItem('role');

  setAuthToken(null);

  return {
    token: null,
    user: null,
  };
}

function createUserFromToken(
  decodedToken: TokenPayload,
): AuthUser {
  return {
    id: decodedToken.sub,
    email: decodedToken.email,
    role: decodedToken.role,
  };
}

function getStoredSession(): AuthSession {
  const storedToken =
    localStorage.getItem('token');

  if (!storedToken) {
    setAuthToken(null);

    return {
      token: null,
      user: null,
    };
  }

  const decodedToken =
    decodeToken(storedToken);

  if (!decodedToken) {
    return clearStoredSession();
  }

  const tokenExpired =
    decodedToken.exp * 1000 <=
    Date.now();

  if (tokenExpired) {
    return clearStoredSession();
  }

  setAuthToken(storedToken);

  return {
    token: storedToken,
    user:
      createUserFromToken(
        decodedToken,
      ),
  };
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] =
    useState<AuthSession>(
      getStoredSession,
    );

  const signIn = useCallback(
    (newToken: string) => {
      const decodedToken =
        decodeToken(newToken);

      if (!decodedToken) {
        throw new Error(
          'Token de autenticação inválido.',
        );
      }

      const tokenExpired =
        decodedToken.exp * 1000 <=
        Date.now();

      if (tokenExpired) {
        throw new Error(
          'O token de autenticação está expirado.',
        );
      }

      const authenticatedUser =
        createUserFromToken(
          decodedToken,
        );

      localStorage.setItem(
        'token',
        newToken,
      );

      localStorage.setItem(
        'role',
        authenticatedUser.role,
      );

      setAuthToken(newToken);

      setSession({
        token: newToken,
        user: authenticatedUser,
      });
    },
    [],
  );

  const signOut =
    useCallback(() => {
      setSession(
        clearStoredSession(),
      );
    }, []);

  useEffect(() => {
    const handleUnauthorized =
      () => {
        setSession(
          clearStoredSession(),
        );
      };

    window.addEventListener(
      'auth:unauthorized',
      handleUnauthorized,
    );

    return () => {
      window.removeEventListener(
        'auth:unauthorized',
        handleUnauthorized,
      );
    };
  }, []);

  const contextValue =
    useMemo<AuthContextData>(
      () => ({
        user: session.user,
        token: session.token,
        isAuthenticated:
          Boolean(
            session.token &&
              session.user,
          ),
        isAdmin:
          session.user?.role ===
          'ADMIN',
        signIn,
        signOut,
      }),
      [
        session,
        signIn,
        signOut,
      ],
    );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}