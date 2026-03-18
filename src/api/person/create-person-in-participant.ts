import { api } from '@/lib/axios';

export interface UpdatePersonData {
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
}

export async function createPersonInParticipant(
  participantId: string,
  data: UpdatePersonData
) {
  const response = await api.post(
    `/participants/create/person/${participantId}`,
    data
  );
  return response.data;
}
