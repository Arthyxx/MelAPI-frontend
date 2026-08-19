interface PerfilMessagesProps {
  error: string;
  success: string;
}

export function PerfilMessages({
  error,
  success,
}: PerfilMessagesProps) {
  return (
    <>
      {error && (
        <div
          role="alert"
          className="mb-6 animate-fade-in rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-6 animate-fade-in rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
        >
          {success}
        </div>
      )}
    </>
  );
}