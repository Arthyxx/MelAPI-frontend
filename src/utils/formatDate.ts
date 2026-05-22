export function formatDate(date?: string | null) {
  if (!date) {
    return 'Data não informada';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Data inválida';
  }

  return parsedDate.toLocaleDateString('pt-BR');
}

export function formatDateTime(date?: string | null) {
  if (!date) {
    return 'Data não informada';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Data inválida';
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}