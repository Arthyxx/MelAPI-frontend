import {
  perfilInputClass,
  perfilLabelClass,
} from './perfil.constants';

import type {
  PerfilFormData,
} from './perfil.types';

interface PerfilAddressProps {
  formData: PerfilFormData;
  onChange: (
    field: keyof PerfilFormData,
    value: string,
  ) => void;
}

export function PerfilAddress({
  formData,
  onChange,
}: PerfilAddressProps) {
  return (
    <section className="animate-fade-in-up delay-100">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl">
          🏠
        </div>

        <div>
          <h3 className="text-lg font-black text-amber-900 dark:text-amber-300">
            Endereço de entrega
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Usado para facilitar a
            entrega dos pedidos.
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
            CEP
          </label>

          <input
            type="text"
            placeholder="60000000"
            value={
              formData.zipCode
            }
            onChange={(event) =>
              onChange(
                'zipCode',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
          />
        </div>

        <div>
          <label
            className={
              perfilLabelClass
            }
          >
            Estado
          </label>

          <input
            type="text"
            placeholder="CE"
            value={
              formData.state
            }
            onChange={(event) =>
              onChange(
                'state',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
          />
        </div>

        <div>
          <label
            className={
              perfilLabelClass
            }
          >
            Cidade
          </label>

          <input
            type="text"
            placeholder="Fortaleza"
            value={
              formData.city
            }
            onChange={(event) =>
              onChange(
                'city',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
          />
        </div>

        <div>
          <label
            className={
              perfilLabelClass
            }
          >
            Bairro
          </label>

          <input
            type="text"
            placeholder="Centro"
            value={
              formData.neighborhood
            }
            onChange={(event) =>
              onChange(
                'neighborhood',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
          />
        </div>

        <div className="md:col-span-2">
          <label
            className={
              perfilLabelClass
            }
          >
            Rua
          </label>

          <input
            type="text"
            placeholder="Rua das Flores"
            value={
              formData.street
            }
            onChange={(event) =>
              onChange(
                'street',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
          />
        </div>

        <div>
          <label
            className={
              perfilLabelClass
            }
          >
            Número
          </label>

          <input
            type="text"
            placeholder="123"
            value={
              formData.addressNumber
            }
            onChange={(event) =>
              onChange(
                'addressNumber',
                event.target.value,
              )
            }
            className={
              perfilInputClass
            }
          />
        </div>

        <div>
          <label
            className={
              perfilLabelClass
            }
          >
            Complemento
          </label>

          <input
            type="text"
            placeholder="Apartamento, bloco, referência..."
            value={
              formData.complement
            }
            onChange={(event) =>
              onChange(
                'complement',
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