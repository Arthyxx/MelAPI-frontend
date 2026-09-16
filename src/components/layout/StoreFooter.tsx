import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const supportContacts = [
  {
    label: 'Atendimento 1',
    phone: '+55 88 99211-4059',
    whatsapp: '5588992114059',
  },
  {
    label: 'Atendimento 2',
    phone: '+55 88 99355-7013',
    whatsapp: '5588993557013',
  },
];

const supportEmail = 'apiariovitoriaseven@gmail.com';

const supportMessage = encodeURIComponent(
  'Olá! Gostaria de atendimento do Apiário Vitória Seven.',
);

function getWhatsAppUrl(phone: string) {
  return `https://wa.me/${phone}?text=${supportMessage}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.45 0 .09 5.36.09 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.24-1.64a11.94 11.94 0 0 0 5.8 1.48h.01C18.64 23.84 24 18.48 24 11.89c0-3.19-1.24-6.18-3.48-8.41ZM12.05 21.82a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.87 9.87 0 0 1-1.51-5.27c0-5.48 4.46-9.94 9.95-9.94a9.86 9.86 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.9 7.03c0 5.48-4.46 9.87-10.01 9.87Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

interface StoreFooterProps {
  isLogged: boolean;
}

export function StoreFooter({ isLogged }: StoreFooterProps) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const supportRef = useRef<HTMLDivElement>(null);
  const supportButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isSupportOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !supportRef.current?.contains(event.target)
      ) {
        setIsSupportOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSupportOpen(false);
        supportButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSupportOpen]);

  return (
    <>
      <style>{`
        .store-support-panel {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(12px) scale(0.96);
          transform-origin: bottom right;
          transition:
            opacity 180ms ease,
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0s linear 220ms;
        }

        .store-support-panel[data-open='true'] {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0) scale(1);
          transition-delay: 0s;
        }

        .store-support-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            opacity 180ms ease,
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .store-support-icon-whatsapp {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        .store-support-icon-close {
          opacity: 0;
          transform: rotate(-90deg) scale(0.6);
        }

        .store-support-toggle[aria-expanded='true']
          .store-support-icon-whatsapp {
          opacity: 0;
          transform: rotate(45deg) scale(0.6);
        }

        .store-support-toggle[aria-expanded='true']
          .store-support-icon-close {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .store-support-panel,
          .store-support-icon,
          .store-support-toggle,
          .store-support-contact {
            transition: none !important;
          }

          .store-support-panel,
          .store-support-contact,
          .store-support-toggle {
            transform: none !important;
          }
        }
      `}</style>

      <footer className="border-t border-amber-800 bg-amber-950 text-amber-50">
        <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-3xl shadow-inner">
                🍯
              </div>

              <div>
                <h3 className="text-xl font-black">
                  Apiário Vitória Seven
                </h3>

                <p className="text-sm text-amber-200">
                  Produtos naturais e artesanais
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-amber-100">
              Loja especializada em produtos de mel, criada para oferecer uma
              experiência moderna, simples e confiável para clientes que procuram
              produtos naturais.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
                🐝 Natural
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
                🍯 Artesanal
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
                📦 Pedidos online
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-black text-white">Loja</h4>

            <ul className="mt-4 space-y-3 text-sm text-amber-100">
              <li>
                <Link to="/produtos" className="transition hover:text-white">
                  Produtos
                </Link>
              </li>

              <li>
                <Link to="/carrinho" className="transition hover:text-white">
                  Carrinho
                </Link>
              </li>

              <li>
                <Link to="/meus-pedidos" className="transition hover:text-white">
                  Meus pedidos
                </Link>
              </li>

              {!isLogged && (
                <li>
                  <Link to="/login" className="transition hover:text-white">
                    Entrar
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="font-black text-white">Atendimento</h4>

            <ul className="mt-4 space-y-4 text-sm text-amber-100">
              <li>📍 Viçosa do Ceará - CE</li>

              {supportContacts.map((contact) => (
                <li key={contact.whatsapp}>
                  <a
                    href={getWhatsAppUrl(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${contact.label} pelo WhatsApp: ${contact.phone} (abre em nova aba)`}
                    className="inline-flex items-center gap-2 rounded transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0" />

                    <span>{contact.phone}</span>
                  </a>
                </li>
              ))}

              <li>
                <a
                  href={`mailto:${supportEmail}`}
                  className="break-words rounded transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                >
                  {supportEmail}
                </a>
              </li>

              <li>📦 Entrega a combinar</li>
              <li>🔒 Compra com login seguro</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 pb-24 pt-5">
          <div className="container mx-auto flex flex-col gap-3 text-sm text-amber-200 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Apiário Vitória Seven. Todos os
              direitos reservados.
            </p>

            <p>Desenvolvido com React + NestJS.</p>
          </div>
        </div>
      </footer>

      <div
        ref={supportRef}
        className="fixed z-40"
        style={{
          right: 'max(1rem, env(safe-area-inset-right))',
          bottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <button
          ref={supportButtonRef}
          type="button"
          aria-label={
            isSupportOpen
              ? 'Fechar contatos do WhatsApp'
              : 'Abrir contatos do WhatsApp'
          }
          aria-expanded={isSupportOpen}
          aria-controls="store-whatsapp-support"
          onClick={() => setIsSupportOpen((current) => !current)}
          className="store-support-toggle relative flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700"
        >
          <span className="store-support-icon store-support-icon-whatsapp">
            <WhatsAppIcon className="h-7 w-7" />
          </span>

          <span className="store-support-icon store-support-icon-close">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-7 w-7"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </span>
        </button>

        <section
          id="store-whatsapp-support"
          aria-labelledby="store-whatsapp-title"
          aria-hidden={!isSupportOpen}
          inert={!isSupportOpen}
          data-open={isSupportOpen}
          className="store-support-panel absolute bottom-full right-0 mb-3 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-800 shadow-xl"
        >
          <div className="bg-green-700 px-4 py-4 text-white">
            <h2 id="store-whatsapp-title" className="font-bold">
              Fale com a loja
            </h2>

            <p className="mt-1 text-sm text-green-50">
              Escolha um contato para conversar pelo WhatsApp.
            </p>
          </div>

          <ul className="space-y-2 p-3">
            {supportContacts.map((contact) => (
              <li key={contact.whatsapp}>
                <a
                  href={getWhatsAppUrl(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${contact.label}: ${contact.phone}, abrir WhatsApp em nova aba`}
                  className="store-support-contact flex items-center gap-3 rounded-xl border border-stone-200 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-green-700 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                >
                  <WhatsAppIcon className="h-6 w-6 shrink-0 text-green-700" />

                  <span>
                    <span className="block text-sm font-bold">
                      {contact.label}
                    </span>

                    <span className="block text-sm text-stone-600">
                      {contact.phone}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
