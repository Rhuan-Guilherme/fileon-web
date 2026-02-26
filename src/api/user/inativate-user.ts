import { api } from '@/lib/axios';

interface InvalidateUserRequest {
  userId: string;
  tenantId: string;
  tenantOperator: string;
}

export function invalidateUser({
  tenantId,
  tenantOperator,
  userId,
}: InvalidateUserRequest) {
  return api.put('/user/invalidate', { tenantId, tenantOperator, userId });
}
