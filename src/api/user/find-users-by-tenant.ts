import { api } from '@/lib/axios';

export type UserRole = 'ADMIN' | 'GERENTE';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  role: UserRole;
  tenantId: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

export interface UsersByTenantResponse {
  users: User[];
  total: number;
}

export async function findUsersByTenant(
  tenantId: string
): Promise<UsersByTenantResponse> {
  const response = await api.get(`/user/tenant/${tenantId}`);

  return response.data;
}
