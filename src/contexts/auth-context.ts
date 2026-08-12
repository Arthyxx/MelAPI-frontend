import { createContext } from 'react';

import type {
  UserRole,
} from '../utils/decodeToken';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}

export const AuthContext =
  createContext<
    AuthContextData | undefined
  >(undefined);