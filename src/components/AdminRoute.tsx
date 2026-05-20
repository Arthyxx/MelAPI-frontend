import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/decodeToken';
import type { JSX } from 'react';

export function AdminRoute({ children }: { children: JSX.Element }) {
  const role = getUserRole();
  if (role !== 'ADMIN') {
    return <Navigate to="/produtos" replace />;
  }
  return children;
}