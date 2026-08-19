import type {
  CadastroFormData,
} from './cadastro.types';

export const initialCadastroFormData:
  CadastroFormData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  };

export const cadastroInputClass =
  'w-full rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-gray-900 shadow-sm outline-none transition duration-300 placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 dark:border-amber-800 dark:bg-gray-950/80 dark:text-white dark:focus:ring-amber-900';

export const cadastroLabelClass =
  'mb-2 block text-sm font-bold text-amber-900 dark:text-amber-300';