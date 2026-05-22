import { Link } from 'react-router-dom';

interface StoreSidebarMenuProps {
  isLogged: boolean;
  menuOpen: boolean;
  cartItemsCount: number;
  role: string | null;
  onClose: () => void;
  onLogout: () => void;
}

export function StoreSidebarMenu({
  isLogged,
  menuOpen,
  cartItemsCount,
  role,
  onClose,
  onLogout,
}: StoreSidebarMenuProps) {
  if (!isLogged) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm transform border-l border-amber-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-amber-900 dark:bg-gray-950 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-4xl shadow-inner">
                  🍯
                </div>

                <h2 className="mt-4 text-2xl font-black">Minha conta</h2>

                <p className="mt-1 text-sm text-amber-100">
                  Gerencie suas compras e pedidos
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl font-black transition hover:bg-white/25"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            <Link
                to="/perfil"
                onClick={onClose}
                className="group flex items-center justify-between rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-amber-900 dark:from-gray-900 dark:to-amber-950/30"
                >
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-gray-950">
                    👤
                    </div>

                    <div>
                        <p className="font-black text-amber-950 dark:text-amber-300">
                            Perfil
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Dados da conta e preferências
                        </p>
                    </div>
                </div>

                <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                    →
                </span>
            </Link>

            <Link
              to="/carrinho"
              onClick={onClose}
              className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-100 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm dark:bg-gray-950">
                  🛒
                </div>

                <div>
                  <p className="font-black text-amber-950 dark:text-amber-300">
                    Carrinho
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </div>

              <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/meus-pedidos"
              onClick={onClose}
              className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm dark:bg-amber-950">
                  📦
                </div>

                <div>
                  <p className="font-black text-amber-950 dark:text-amber-300">
                    Meus pedidos
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Acompanhe suas compras
                  </p>
                </div>
              </div>

              <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/produtos"
              onClick={onClose}
              className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm dark:bg-amber-950">
                  🍯
                </div>

                <div>
                  <p className="font-black text-amber-950 dark:text-amber-300">
                    Produtos
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Voltar para a loja
                  </p>
                </div>
              </div>

              <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                →
              </span>
            </Link>

            {role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={onClose}
                className="group flex items-center justify-between rounded-3xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-lg dark:border-amber-900 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm dark:bg-amber-950">
                    ⚙️
                  </div>

                  <div>
                    <p className="font-black text-amber-950 dark:text-amber-300">
                      Painel admin
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gerenciar loja
                    </p>
                  </div>
                </div>

                <span className="text-xl text-amber-700 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>

          <div className="border-t border-amber-100 p-5 dark:border-amber-900">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-red-600 hover:shadow-xl"
            >
              <span>🚪</span>
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}