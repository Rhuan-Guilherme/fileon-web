import { api } from '@/lib/axios';

export function getOrganizationsUser() {
  return api.get('/organizations');
}
