import { api } from '@/lib/axios';

interface FindProcessByTenantParams {
  name?: string;
  status?:
    | 'NOVO'
    | 'EM_ANDAMENTO'
    | 'FINALIZADO'
    | 'CANCELADO'
    | 'DOCUMENTACAO_PENDENTE'
    | 'DOCUMENTACAO_COMPLETA'
    | 'EM_ANALISE';
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
