import axios, {
  type AxiosError,
} from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.trim();

if (!apiBaseUrl) {
  throw new Error(
    'A variável de ambiente VITE_API_URL não foi configurada.',
  );
}

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        'token',
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    } else {
      delete config.headers
        .Authorization;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(
      error,
    );
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isUnauthorized =
      error.response?.status ===
      401;

    const isLoginRequest =
      error.config?.url ===
      '/auth/login';

    if (
      isUnauthorized &&
      !isLoginRequest
    ) {
      localStorage.removeItem(
        'token',
      );

      localStorage.removeItem(
        'role',
      );

      delete api.defaults.headers
        .common.Authorization;

      window.dispatchEvent(
        new Event(
          'auth:unauthorized',
        ),
      );
    }

    return Promise.reject(
      error,
    );
  },
);

export async function login(
  email: string,
  password: string,
) {
  const response =
    await api.post(
      '/auth/login',
      {
        email,
        password,
      },
    );

  return response.data;
}

export function setAuthToken(
  token: string | null,
) {
  if (token) {
    api.defaults.headers.common
      .Authorization =
      `Bearer ${token}`;

    return;
  }

  delete api.defaults.headers
    .common.Authorization;
}