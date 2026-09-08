import { api } from '../../services/api';

import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  PerfilFormData,
} from './perfil.types';

export async function fetchPerfilApi() {
  const response =
    await api.get<PerfilFormData>(
      '/clientes/me',
    );

  return response.data;
}

export async function updatePerfilApi(
  payload: Omit<
    PerfilFormData,
    'id' | 'email' | 'role'
  >,
) {
  const response =
    await api.patch<PerfilFormData>(
      '/clientes/me',
      payload,
    );

  return response.data;
}

export async function changePasswordApi(
  payload: ChangePasswordPayload,
) {
  const response =
    await api.patch<ChangePasswordResponse>(
      '/clientes/me/password',
      payload,
    );

  return response.data;
}
