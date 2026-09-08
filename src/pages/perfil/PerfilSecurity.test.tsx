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

import { PerfilSecurity } from './PerfilSecurity';

const changePasswordApiMock = vi.fn();
const signOutMock = vi.fn();

vi.mock('./perfil.api', () => ({
  changePasswordApi: (
    payload: {
      currentPassword: string;
      newPassword: string;
    },
  ) =>
    changePasswordApiMock(
      payload,
    ),
}));

vi.mock(
  '../../contexts/useAuth',
  () => ({
    useAuth: () => ({
      signOut: signOutMock,
    }),
  }),
);

function renderPerfilSecurity() {
  return render(
    <MemoryRouter
      initialEntries={['/perfil']}
    >
      <Routes>
        <Route
          path="/perfil"
          element={<PerfilSecurity />}
        />

        <Route
          path="/login"
          element={
            <div>
              Página de login
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PerfilSecurity', () => {
  beforeEach(() => {
    changePasswordApiMock.mockReset();
    signOutMock.mockReset();

    vi.spyOn(
      console,
      'error',
    ).mockImplementation(
      () => undefined,
    );
  });

  it('deve alterar a senha, encerrar a sessão e redirecionar para login', async () => {
    const user =
      userEvent.setup();

    changePasswordApiMock.mockResolvedValue({
      message:
        'Senha alterada com sucesso.',
    });

    renderPerfilSecurity();

    await user.type(
      screen.getByLabelText(
        'Senha atual',
      ),
      'senha-atual',
    );

    await user.type(
      screen.getByLabelText(
        'Nova senha',
      ),
      'nova-senha-123',
    );

    await user.type(
      screen.getByLabelText(
        'Confirmar nova senha',
      ),
      'nova-senha-123',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: /Alterar senha/i,
        },
      ),
    );

    await waitFor(() => {
      expect(
        changePasswordApiMock,
      ).toHaveBeenCalledWith({
        currentPassword:
          'senha-atual',
        newPassword:
          'nova-senha-123',
      });
    });

    expect(
      signOutMock,
    ).toHaveBeenCalledTimes(1);

    expect(
      screen.getByText(
        'Página de login',
      ),
    ).toBeInTheDocument();
  });

  it('não deve enviar quando confirmação da senha for diferente', async () => {
    const user =
      userEvent.setup();

    renderPerfilSecurity();

    await user.type(
      screen.getByLabelText(
        'Senha atual',
      ),
      'senha-atual',
    );

    await user.type(
      screen.getByLabelText(
        'Nova senha',
      ),
      'nova-senha-123',
    );

    await user.type(
      screen.getByLabelText(
        'Confirmar nova senha',
      ),
      'senha-diferente',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: /Alterar senha/i,
        },
      ),
    );

    expect(
      await screen.findByText(
        'A confirmação da nova senha não corresponde.',
      ),
    ).toBeInTheDocument();

    expect(
      changePasswordApiMock,
    ).not.toHaveBeenCalled();

    expect(
      signOutMock,
    ).not.toHaveBeenCalled();
  });

  it('deve exibir erro retornado pela API', async () => {
    const user =
      userEvent.setup();

    changePasswordApiMock.mockRejectedValue({
      response: {
        status: 401,
        data: {
          message:
            'Senha atual inválida.',
        },
      },

      message:
        'Request failed with status code 401',

      isAxiosError: true,
    });

    renderPerfilSecurity();

    await user.type(
      screen.getByLabelText(
        'Senha atual',
      ),
      'senha-errada',
    );

    await user.type(
      screen.getByLabelText(
        'Nova senha',
      ),
      'nova-senha-123',
    );

    await user.type(
      screen.getByLabelText(
        'Confirmar nova senha',
      ),
      'nova-senha-123',
    );

    await user.click(
      screen.getByRole(
        'button',
        {
          name: /Alterar senha/i,
        },
      ),
    );

    expect(
      await screen.findByText(
        'Senha atual inválida.',
      ),
    ).toBeInTheDocument();

    expect(
      signOutMock,
    ).not.toHaveBeenCalled();

    expect(
      screen.queryByText(
        'Página de login',
      ),
    ).not.toBeInTheDocument();
  });

  it('deve permitir mostrar e ocultar a senha atual', async () => {
    const user =
      userEvent.setup();

    renderPerfilSecurity();

    const passwordInput =
      screen.getByLabelText(
        'Senha atual',
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
          name:
            'Mostrar senha atual',
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
          name:
            'Ocultar senha atual',
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
