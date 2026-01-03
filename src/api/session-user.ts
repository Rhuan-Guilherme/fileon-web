import { api } from '@/lib/axios';

export async function getSessionUser() {
  const response = await api.get('/user/session');
  return response.data;
}
