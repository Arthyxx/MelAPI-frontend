import type {
  PerfilFormData,
} from './perfil.types';

export const initialPerfilFormData:
  PerfilFormData = {
    name: '',
    email: '',
    phone: '',
    street: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  };

export const perfilInputClass =
  'w-full rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-gray-900 shadow-sm outline-none transition duration-300 placeholder:text-gray-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 dark:border-amber-800 dark:bg-gray-950/80 dark:text-white dark:focus:ring-amber-900';

export const perfilDisabledInputClass =
  'w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 shadow-sm outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400';

export const perfilLabelClass =
  'mb-2 block text-sm font-bold text-amber-900 dark:text-amber-300';