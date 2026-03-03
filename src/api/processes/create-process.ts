import { api } from '@/lib/axios';

interface CreateProcessParams {
  name: string;
  tenantId: string;
  processType: 'PLANTA' | 'NOVO' | 'INDIVIDUAL';
  clientName: string;
  vgv?: string;
}

export async function createProcess({
  name,
  tenantId,
  processType,
  clientName,
  vgv,
}: CreateProcessParams) {
  const process = await api.post('/processes', {
    name,
    tenantId,
    processType,
    clientName,
    vgv,
  });

  return process.data;
}
