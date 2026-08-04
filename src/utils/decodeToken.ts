import { jwtDecode } from 'jwt-decode';

export type UserRole = 'ADMIN' | 'CLIENTE';

export interface TokenPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
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