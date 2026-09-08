import {
  useState,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/useAuth';

import { changePasswordApi } from './perfil.api';

import {
  getPerfilApiErrorMessage,
  logPerfilApiError,
} from './perfil.utils';

export function useChangePassword() {
  const navigate = useNavigate();

  const { signOut } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [
    confirmNewPassword,
    setConfirmNewPassword,
  ] = useState('');

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState('');

  const handleChangePassword = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError(
        'A nova senha deve possuir pelo menos 6 caracteres.',
      );

      return;
    }

    if (newPassword.length > 72) {
      setPasswordError(
        'A nova senha deve possuir no máximo 72 caracteres.',
      );

      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError(
        'A confirmação da nova senha não corresponde.',
      );

      return;
    }

    try {
      setSavingPassword(true);

      await changePasswordApi({
        currentPassword,
        newPassword,
      });

      signOut();

      navigate('/login', {
        replace: true,
      });
    } catch (err: unknown) {
      logPerfilApiError(
        'Erro ao alterar senha:',
        err,
      );

      setPasswordError(
        getPerfilApiErrorMessage(
          err,
          'Não foi possível alterar a senha. Tente novamente.',
        ),
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return {
    currentPassword,
    newPassword,
    confirmNewPassword,
    savingPassword,
    passwordError,

    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,

    handleChangePassword,
  };
}
