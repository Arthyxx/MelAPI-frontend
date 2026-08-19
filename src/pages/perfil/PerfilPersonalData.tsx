import {
  perfilDisabledInputClass,
  perfilInputClass,
  perfilLabelClass,
} from './perfil.constants';

import type {
  PerfilFormData,
} from './perfil.types';

interface PerfilPersonalDataProps {
  formData: PerfilFormData;
  onChange: (
    field: keyof PerfilFormData,
    value: string,
  ) => void;
}

export function PerfilPersonalData({
  formData,
  onChange,
}: PerfilPersonalDataProps) {
  return (
    <section className="animate-fade-in-up">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
          👤
        </div>

        <div>
          <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
            Dados pessoais
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nome, e-mail e telefone de
            contato.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            className={
              perfilLabelClass
            }
          >
            Nome completo
          </label>

          <input
            type="text"
            value={
              formData.name
            }
            onChange={(event) =>
              onChange(
                'name',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
            required
          />
        </div>

        <div>
          <label
            className={
              perfilLabelClass
            }
          >
            E-mail
          </label>

          <input
            type="email"
            value={
              formData.email
            }
            className={
              perfilDisabledInputClass
            }
            disabled
          />

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            O e-mail não pode ser
            alterado por aqui.
          </p>
        </div>

        <div className="md:col-span-2">
          <label
            className={
              perfilLabelClass
            }
          >
            Telefone
          </label>

          <input
            type="tel"
            placeholder="85999999999"
            value={
              formData.phone
            }
            onChange={(event) =>
              onChange(
                'phone',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
          />
        </div>
      </div>
    </section>
  );
}