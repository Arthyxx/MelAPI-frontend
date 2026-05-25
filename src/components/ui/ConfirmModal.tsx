interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const variantStyles = {
    default:
      'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:shadow-amber-500/30',
    warning:
      'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 hover:shadow-orange-500/30',
    danger:
      'bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:shadow-red-500/30',
  };

  const icon = {
    default: '🍯',
    warning: '⚠️',
    danger: '🧺',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Fechar confirmação"
      />

      <div className="relative w-full max-w-md animate-fade-in-up overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-2xl dark:border-amber-900 dark:bg-gray-950">
        <div className="p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 text-4xl shadow-inner dark:from-amber-950 dark:to-gray-900">
            {icon[variant]}
          </div>

          <h3 className="mt-5 text-2xl font-black text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-2xl px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]}`}
            >
              {loading ? 'Processando...' : confirmText}
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
      </div>
    </div>
  );
}