import { api } from '../../../services/api';

import type {
  ClienteFormData,
  ClientesResponse,
} from './cliente.types';

interface FetchClientesParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  active?: string;
}

interface UpdateClientePayload {
  name: string;
  email: string;
  role: ClienteFormData['role'];
  active: boolean;
  password?: string;
}

interface CreateClientePayload {
  name: string;
  email: string;
  password: string;
  role: ClienteFormData['role'];
  active: boolean;
}

export async function fetchClientesApi(
  params: FetchClientesParams,
) {
  const response =
    await api.get<ClientesResponse>(
      '/clientes',
      {
        params,
      },
    );

  return response.data;
}

export async function createClienteApi(
  payload: CreateClientePayload,
) {
  await api.post(
    '/clientes/admin',
    payload,
  );
}

export async function updateClienteApi(
  clienteId: number,
  payload: UpdateClientePayload,
) {
  await api.patch(
    `/clientes/${clienteId}`,
    payload,
  );
}

export async function deleteClienteApi(
  clienteId: number,
) {
  await api.delete(
    `/clientes/${clienteId}`,
  );
}

export function createClientePayload(
  formData: ClienteFormData,
): CreateClientePayload {
  return {
    name: formData.name.trim(),
    email:
      formData.email
        .trim()
        .toLowerCase(),
    password: formData.password,
    role: formData.role,
    active: formData.active,
  };
}

export function createUpdateClientePayload(
  formData: ClienteFormData,
): UpdateClientePayload {
  return {
    name: formData.name.trim(),
    email:
      formData.email
        .trim()
        .toLowerCase(),
    role: formData.role,
    active: formData.active,
    ...(formData.password
      ? {
          password:
            formData.password,
        }
      : {}),
  };
}