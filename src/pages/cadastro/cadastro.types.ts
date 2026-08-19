export interface CadastroFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  street: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}