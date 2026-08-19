interface CadastroMessagesProps {
  erro: string;
  sucesso: string;
}

export function CadastroMessages({
  erro,
  sucesso,
}: CadastroMessagesProps) {
  return (
    <>
      {erro && (
        <div
          role="alert"
          className="mb-6 animate-fade-in rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {erro}
        </div>
      )}

      {sucesso && (
        <div
          role="status"
          className="mb-6 animate-fade-in rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
        >
          {sucesso}
        </div>
      )}
    </>
  );
}