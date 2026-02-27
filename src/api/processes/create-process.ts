import { api } from '@/lib/axios';

interface CreateProcessParams {
  name: string;
  description: string;
  tenantId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export async function createProcess({
  description,
  name,
  tenantId,
  data,
}: CreateProcessParams) {
  const process = await api.post('/processes', {
    name,
    description,
    tenantId,
    data,
  });

  return process.data;
}
