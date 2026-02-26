import { api } from '@/lib/axios';

interface ActiveUserRequest {
  userId: string;
  tenantId: string;
  tenantOperator: string;
}

export function activeUser({
  tenantId,
  tenantOperator,
  userId,
}: ActiveUserRequest) {
  return api.put('/user/active', { tenantId, tenantOperator, userId });
}
