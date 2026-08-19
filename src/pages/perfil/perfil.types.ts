export interface PerfilFormData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  street: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  role?: string;
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}