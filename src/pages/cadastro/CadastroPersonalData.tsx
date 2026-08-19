import {
  cadastroInputClass,
  cadastroLabelClass,
} from './cadastro.constants';

import type {
  CadastroFormData,
} from './cadastro.types';

interface CadastroPersonalDataProps {
  formData: CadastroFormData;
  onChange: (
    field: keyof CadastroFormData,
    value: string,
  ) => void;
}

export function CadastroPersonalData({
  formData,
  onChange,
}: CadastroPersonalDataProps) {
  return (
    <section className="animate-fade-in-up delay-100">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
          👤
        </div>

        <div>
          <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
            Dados pessoais
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Informações básicas da sua
            conta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            className={
              cadastroLabelClass
            }
          >
            Nome completo
          </label>

          <input
            type="text"
            placeholder="Ex: Carlos Silva"
            value={formData.name}
            onChange={(event) =>
              onChange(
                'name',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            required
          />
        </div>

        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            E-mail
          </label>

          <input
            type="email"
            placeholder="seuemail@email.com"
            value={formData.email}
            onChange={(event) =>
              onChange(
                'email',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            required
          />
        </div>

        <div>
          <label
            className={
              cadastroLabelClass
            }
          >
            Senha
          </label>

          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(event) =>
              onChange(
                'password',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            minLength={6}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            className={
              cadastroLabelClass
            }
          >
            Telefone
          </label>

          <input
            type="tel"
            placeholder="85999999999"
            value={formData.phone}
            onChange={(event) =>
              onChange(
                'phone',
                event.target.value,
              )
            }
            className={
              cadastroInputClass
            }
            required
          />
        </div>
      </div>
    </section>
  );
}