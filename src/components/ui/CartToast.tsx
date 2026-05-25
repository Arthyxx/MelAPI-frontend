interface CartToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function CartToast({ message, visible, onClose }: CartToastProps) {
  return (
    <div
      className={`fixed right-4 top-24 z-[9999] w-[calc(100%-2rem)] max-w-sm transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-4 pointer-events-none opacity-0'
      }`}
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-amber-200 bg-white shadow-2xl dark:border-amber-900 dark:bg-gray-950">
        <div className="flex items-start gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 text-2xl shadow-sm dark:from-amber-950 dark:to-gray-900">
            🛒
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-black text-gray-900 dark:text-white">
              Produto adicionado
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-lg font-black text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
      </div>
    </div>
  );
}