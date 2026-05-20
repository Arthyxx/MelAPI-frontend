import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  id: number;
  role: string;
  exp: number;
  iss: string;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Erro ao decodificar token', error);
    return null;
  }
};

export const getUserRole = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.role || null;
};