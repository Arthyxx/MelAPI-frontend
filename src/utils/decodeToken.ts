import { jwtDecode } from 'jwt-decode';

export type UserRole = 'ADMIN' | 'CLIENTE';

export interface TokenPayload {
  sub: string;
  id: number;
  role: UserRole;
  exp: number;
  iss?: string;
}

export function decodeToken(
  token: string,
): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error(
      'Erro ao decodificar o token:',
      error,
    );

    return null;
  }
}