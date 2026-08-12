import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Login } from './Login';

const loginMock = vi.fn();
const signInMock = vi.fn();

vi.mock('../services/api', () => ({
  login: (
    email: string,
    password: string,
  ) =>
    loginMock(
      email,
      password,
    ),
}));

vi.mock(
  '../contexts/useAuth',
  () => ({
    useAuth: () => ({
      signIn: signInMock,
    }),
  }),
);

function renderLogin() {
  return render(
    <MemoryRouter
      initialEntries={['/login']}
    >
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/produtos"
          element={
            <div>
              Página de produtos
            </div>
          }
        />

        <Route
          path="/cadastro"
          element={
            <div>
              Página de cadastro
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Login', () => {
  beforeEach(() => {
    loginMock.mockReset();
    signInMock.mockReset();

    vi.spyOn(
      console,
      'error',
    ).mockImplementation(
      () => undefined,
    );
  });

  it('deve fazer login e redirecionar para produtos', async () => {
    const user =
      userEvent.setup();

    loginMock.mockResolvedValue({
      token: 'token-valido',
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(
        'E-mail',
      ),
      '  CLIENTE@EMAIL.COM  ',
    );

    await user.type(
      screen.getByLabelText(
        'Senha',
      ),
      '123456',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: /Entrar na loja/i,
        },
      ),
    );

    await waitFor(() => {
      expect(
        loginMock,
      ).toHaveBeenCalledWith(
        'cliente@email.com',
        '123456',
      );
    });

    expect(
      signInMock,
    ).toHaveBeenCalledWith(
      'token-valido',
    );

    expect(
      screen.getByText(
        'Página de produtos',
      ),
    ).toBeInTheDocument();
  });

  it('deve exibir erro retornado pela API', async () => {
    const user =
      userEvent.setup();

    loginMock.mockRejectedValue({
      response: {
        status: 401,
        data: {
          message:
            'E-mail ou senha incorretos.',
        },
      },
      message:
        'Request failed with status code 401',
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(
        'E-mail',
      ),
      'cliente@email.com',
    );

    await user.type(
      screen.getByLabelText(
        'Senha',
      ),
      'senha-errada',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: /Entrar na loja/i,
        },
      ),
    );

    expect(
      await screen.findByText(
        'E-mail ou senha incorretos.',
      ),
    ).toBeInTheDocument();

    expect(
      signInMock,
    ).not.toHaveBeenCalled();
  });

  it('deve juntar mensagens de validação retornadas em array', async () => {
    const user =
      userEvent.setup();

    loginMock.mockRejectedValue({
      response: {
        status: 400,
        data: {
          message: [
            'E-mail inválido.',
            'Senha inválida.',
          ],
        },
      },
      message:
        'Request failed with status code 400',
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(
        'E-mail',
      ),
      'cliente@email.com',
    );

    await user.type(
      screen.getByLabelText(
        'Senha',
      ),
      '123',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: /Entrar na loja/i,
        },
      ),
    );

    expect(
      await screen.findByText(
        'E-mail inválido. Senha inválida.',
      ),
    ).toBeInTheDocument();
  });

  it('deve permitir mostrar e ocultar a senha', async () => {
    const user =
      userEvent.setup();

    renderLogin();

    const passwordInput =
      screen.getByLabelText(
        'Senha',
      );

    expect(
      passwordInput,
    ).toHaveAttribute(
      'type',
      'password',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: 'Ver',
        },
      ),
    );

    expect(
      passwordInput,
    ).toHaveAttribute(
      'type',
      'text',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: 'Ocultar',
        },
      ),
    );

    expect(
      passwordInput,
    ).toHaveAttribute(
      'type',
      'password',
    );
  });
});