export function BadgeStatus({ status }: { status: string }) {
  function formatStatus(status: string) {
    const formatted = status.toLowerCase().replace(/_/g, ' ');

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function getStatusStyles(status: string) {
    switch (status) {
      case 'NOVO':
        return `
        bg-blue-50 text-blue-700 border-blue-200
        dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20
      `;

      case 'DOCUMENTACAO_PENDENTE':
        return `
        bg-amber-50 text-amber-700 border-amber-200
        dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20
      `;

      case 'DOCUMENTACAO_COMPLETA':
        return `
        bg-emerald-50 text-emerald-700 border-emerald-200
        dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20
      `;

      case 'EM_ANALISE':
        return `
        bg-purple-50 text-purple-700 border-purple-200
        dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20
      `;

      case 'FINALIZADO':
        return `
        bg-green-50 text-green-700 border-green-200
        dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20
      `;

      case 'CANCELADO':
        return `
        bg-red-50 text-red-700 border-red-200
        dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20
      `;

      default:
        return `
        bg-muted text-muted-foreground border-border
      `;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
        status
      )}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {formatStatus(status)}
    </span>
  );
}
