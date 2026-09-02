import {
  Link,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

type ReturnType =
  | 'success'
  | 'pending'
  | 'failure';

interface ReturnContent {
  icon: string;
  label: string;
  title: string;
  description: string;
  cardClassName: string;
  labelClassName: string;
}

const contentByType: Record<
  ReturnType,
  ReturnContent
> = {
  success: {
    icon: '✅',
    label: 'Pagamento enviado',
    title:
      'Recebemos o retorno do Mercado Pago',
    description:
      'O pagamento foi concluído no Mercado Pago. O status definitivo do pedido será atualizado após a confirmação recebida pelo nosso sistema.',
    cardClassName:
      'border-green-200 dark:border-green-900',
    labelClassName:
      'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  },

  pending: {
    icon: '⏳',
    label: 'Pagamento pendente',
    title:
      'Seu pagamento está sendo processado',
    description:
      'O Mercado Pago informou que o pagamento ainda está pendente ou em análise. Assim que houver confirmação, o status do pedido será atualizado.',
    cardClassName:
      'border-amber-200 dark:border-amber-800',
    labelClassName:
      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },

  failure: {
    icon: '⚠️',
    label: 'Pagamento não concluído',
    title:
      'Não foi possível concluir o pagamento',
    description:
      'O pagamento não foi concluído no Mercado Pago. Seu pedido continua salvo e você poderá tentar pagar novamente pela página de detalhes.',
    cardClassName:
      'border-red-200 dark:border-red-900',
    labelClassName:
      'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  },
};

function getReturnType(
  pathname: string,
): ReturnType {
  if (
    pathname.endsWith(
      '/sucesso',
    )
  ) {
    return 'success';
  }

  if (
    pathname.endsWith(
      '/pendente',
    )
  ) {
    return 'pending';
  }

  return 'failure';
}

export function PagamentoRetorno() {
  const location =
    useLocation();

  const [
    searchParams,
  ] = useSearchParams();

  const returnType =
    getReturnType(
      location.pathname,
    );

  const content =
    contentByType[
      returnType
    ];

  const pedidoIdParam =
    searchParams.get(
      'pedidoId',
    );

  const pedidoId =
    pedidoIdParam &&
    /^\d+$/.test(
      pedidoIdParam,
    )
      ? Number(
          pedidoIdParam,
        )
      : null;

  const pedidoLink =
    pedidoId
      ? `/meus-pedidos/${pedidoId}`
      : '/meus-pedidos';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4 py-12 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950">
      <main
        className={`w-full max-w-2xl overflow-hidden rounded-[2rem] border bg-white shadow-2xl dark:bg-gray-900 ${content.cardClassName}`}
      >
        <div className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gray-50 text-6xl shadow-inner dark:bg-gray-950">
            {content.icon}
          </div>

          <span
            className={`mt-6 inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${content.labelClassName}`}
          >
            {content.label}
          </span>

          <h1 className="mt-5 text-3xl font-black text-gray-900 dark:text-white">
            {content.title}
          </h1>

          {pedidoId && (
            <p className="mt-2 font-black text-amber-700 dark:text-amber-300">
              Pedido #
              {pedidoId}
            </p>
          )}

          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-600 dark:text-gray-400">
            {
              content.description
            }
          </p>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              🔒 O retorno do
              navegador não é usado
              sozinho para confirmar
              pagamentos. O pedido só
              será marcado como pago
              depois que nosso servidor
              validar a confirmação
              diretamente com o Mercado
              Pago.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={pedidoLink}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-7 py-4 font-black text-white shadow-lg transition hover:bg-amber-700 hover:shadow-xl"
            >
              {pedidoId
                ? 'Ver meu pedido'
                : 'Ver meus pedidos'}
            </Link>

            <Link
              to="/produtos"
              className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-7 py-4 font-black text-amber-800 transition hover:bg-amber-50 dark:border-amber-800 dark:bg-gray-900 dark:text-amber-300 dark:hover:bg-gray-800"
            >
              Voltar à loja
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
