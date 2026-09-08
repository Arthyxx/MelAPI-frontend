import {
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

import {
  perfilInputClass,
  perfilLabelClass,
} from './perfil.constants';

import { useChangePassword } from './useChangePassword';

export function PerfilSecurity() {
  const {
    currentPassword,
    newPassword,
    confirmNewPassword,
    savingPassword,
    passwordError,

    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,

    handleChangePassword,
  } = useChangePassword();

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmNewPassword,
    setShowConfirmNewPassword,
  ] = useState(false);

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-amber-200 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-amber-800 dark:bg-gray-900/90">
      <div className="bg-gradient-to-r from-gray-900 via-amber-950 to-gray-900 px-6 py-7 text-white sm:px-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-200">
              Segurança
            </p>

            <h2 className="text-2xl font-black">
              Alterar senha
            </h2>

            <p className="mt-1 text-sm text-gray-300">
              Atualize sua senha de acesso à conta.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {passwordError && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {passwordError}
          </div>
        )}

        <form
          onSubmit={handleChangePassword}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="currentPassword"
              className={perfilLabelClass}
            >
              Senha atual
            </label>

            <div className="relative">
              <input
                id="currentPassword"
                type={
                  showCurrentPassword
                    ? 'text'
                    : 'password'
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value,
                  )
                }
                autoComplete="current-password"
                className={`${perfilInputClass} pr-12`}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (prev) => !prev,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-amber-700 dark:text-gray-400 dark:hover:text-amber-300"
                aria-label={
                  showCurrentPassword
                    ? 'Ocultar senha atual'
                    : 'Mostrar senha atual'
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className={perfilLabelClass}
            >
              Nova senha
            </label>

            <div className="relative">
              <input
                id="newPassword"
                type={
                  showNewPassword
                    ? 'text'
                    : 'password'
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                minLength={6}
                maxLength={72}
                className={`${perfilInputClass} pr-12`}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    (prev) => !prev,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-amber-700 dark:text-gray-400 dark:hover:text-amber-300"
                aria-label={
                  showNewPassword
                    ? 'Ocultar nova senha'
                    : 'Mostrar nova senha'
                }
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Use entre 6 e 72 caracteres.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className={perfilLabelClass}
            >
              Confirmar nova senha
            </label>

            <div className="relative">
              <input
                id="confirmNewPassword"
                type={
                  showConfirmNewPassword
                    ? 'text'
                    : 'password'
                }
                value={confirmNewPassword}
                onChange={(event) =>
                  setConfirmNewPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                minLength={6}
                maxLength={72}
                className={`${perfilInputClass} pr-12`}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(
                    (prev) => !prev,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-amber-700 dark:text-gray-400 dark:hover:text-amber-300"
                aria-label={
                  showConfirmNewPassword
                    ? 'Ocultar confirmação da senha'
                    : 'Mostrar confirmação da senha'
                }
              >
                {showConfirmNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-amber-100 pt-6 dark:border-amber-900/50 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

              <p className="max-w-xl text-sm text-gray-500 dark:text-gray-400">
                Depois da alteração, sua sessão será
                encerrada por segurança e você precisará
                entrar novamente usando a nova senha.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="group relative shrink-0 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 px-7 py-4 font-black text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70 dark:from-amber-700 dark:via-yellow-700 dark:to-amber-800"
            >
              <span className="absolute inset-0 translate-x-[-100%] bg-white/10 transition duration-700 group-hover:translate-x-[100%]" />

              <span className="relative flex items-center justify-center gap-2">
                {savingPassword ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    Alterando...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />

                    Alterar senha
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
