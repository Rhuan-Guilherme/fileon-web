import { api } from '@/lib/axios';

interface CreateTenantRequest {
  name: string;
  cnpj: string;
  adminEmail: string;
  adminPassword: string;
}

export function createTenant({
  adminEmail,
  cnpj,
  name,
  adminPassword,
}: CreateTenantRequest) {
  return api.post('/tenant', {
    name,
    cnpj,
    adminEmail,
    adminPassword,
  });
}
