import type {
  PedidoShipping,
} from '../../types/pedido';
import {
  formatCurrency,
} from '../../utils/formatCurrency';

interface PedidoShippingDetailsProps {
  shippingPrice: number;
  shipping: PedidoShipping;
}

function formatZipCode(
  zipCode: string | null,
) {
  if (!zipCode) {
    return null;
  }

  const digits =
    zipCode.replace(/\D/g, '');

  if (digits.length !== 8) {
    return zipCode;
  }

  return `${digits.slice(
    0,
    5,
  )}-${digits.slice(5)}`;
}

export function PedidoShippingDetails({
  shippingPrice,
  shipping,
}: PedidoShippingDetailsProps) {
  const hasShippingData =
    Boolean(
      shipping.serviceId ||
        shipping.serviceName ||
        shipping.companyName,
    );

  const hasAddress =
    Boolean(
      shipping.address.street ||
        shipping.address.city ||
        shipping.address.zipCode,
    );

  if (
    !hasShippingData &&
    !hasAddress
  ) {
    return (
      <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-xl dark:border-amber-800 dark:bg-gray-900">
        <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-300">
          Entrega
        </h3>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Este pedido foi criado antes
          da integração de frete e não
          possui dados de entrega
          registrados.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-xl dark:border-amber-800 dark:bg-gray-900">
      <div>
        <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-300">
          Entrega
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Modalidade escolhida e
          endereço registrado no momento
          do pedido.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Transportadora
          </p>

          <p className="mt-1 font-black text-amber-900 dark:text-amber-300">
            {shipping.companyName ||
              'Não informada'}
          </p>

          {shipping.serviceName && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {shipping.serviceName}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Valor do frete
          </p>

          <p className="mt-1 font-black text-amber-900 dark:text-amber-300">
            {formatCurrency(
              shippingPrice,
            )}
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Prazo estimado
          </p>

          <p className="mt-1 font-black text-amber-900 dark:text-amber-300">
            {shipping.deliveryTime !==
            null
              ? `${shipping.deliveryTime} ${
                  shipping.deliveryTime ===
                  1
                    ? 'dia útil'
                    : 'dias úteis'
                }`
              : 'Não informado'}
          </p>
        </div>
      </div>

      {hasAddress && (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-900 dark:bg-gray-950">
          <p className="font-black text-gray-900 dark:text-white">
            Endereço de entrega
          </p>

          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p>
              {shipping.address.street ||
                'Endereço não informado'}
              {shipping.address
                .addressNumber
                ? `, ${shipping.address.addressNumber}`
                : ''}
            </p>

            {shipping.address
              .complement && (
              <p>
                {
                  shipping.address
                    .complement
                }
              </p>
            )}

            <p>
              {shipping.address
                .neighborhood ||
                'Bairro não informado'}
            </p>

            <p>
              {shipping.address.city ||
                'Cidade não informada'}
              {shipping.address.state
                ? ` - ${shipping.address.state}`
                : ''}
            </p>

            {shipping.address
              .zipCode && (
              <p className="font-bold">
                CEP:{' '}
                {formatZipCode(
                  shipping.address
                    .zipCode,
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
