import { api } from '@/lib/axios';

export function InviteParticipant(participantId: string) {
  const response = api.post(`/participants/${participantId}/invite`);

  return response;
}
