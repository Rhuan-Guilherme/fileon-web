import { api } from '@/lib/axios';

export const PROCESS_STATUS = {
  NOVO: 'NOVO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
  DOCUMENTACAO_PENDENTE: 'DOCUMENTACAO_PENDENTE',
  DOCUMENTACAO_COMPLETA: 'DOCUMENTACAO_COMPLETA',
  EM_ANALISE: 'EM_ANALISE',
} as const;

export type ProcessStatus =
  (typeof PROCESS_STATUS)[keyof typeof PROCESS_STATUS];

interface FindProcessByTenantParams {
  name?: string;
  status?: ProcessStatus;
  dateFrom?: string;
  dateTo?: string;
  perPage?: number;
  page?: number;
}

export async function findProcessByTenant(
  tenantId: string,
  params?: FindProcessByTenantParams
) {
  const response = await api.get(`/processes/tenant/${tenantId}`, { params });
  return response.data;
}
