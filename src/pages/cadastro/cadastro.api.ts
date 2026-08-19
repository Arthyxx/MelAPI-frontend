import { api } from '../../services/api';

import type {
  CadastroFormData,
} from './cadastro.types';

export async function createCadastroApi(
  payload: CadastroFormData,
) {
  await api.post(
    '/clientes',
    payload,
  );
}