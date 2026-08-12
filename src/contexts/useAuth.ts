import { useContext } from 'react';

import {
  AuthContext,
  type AuthContextData,
} from './auth-context';

export function useAuth(): AuthContextData {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser utilizado dentro de AuthProvider.',
    );
  }

  return context;
}