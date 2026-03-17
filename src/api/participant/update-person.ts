import { api } from '@/lib/axios';

export interface UpdatePersonData {
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
}

export async function updatePerson(personId: string, data: UpdatePersonData) {
  const response = await api.post(
    `/participants/update/person/${personId}`,
    data
  );
  return response.data;
}
