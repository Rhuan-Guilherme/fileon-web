import { api } from '@/lib/axios';

export function logoutUser() {
  return api.post('/user/logout');
}
