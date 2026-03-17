import { api } from '@/lib/axios';

type InviteParticipant = {
  id: string;
  processId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  personId: string | null;
  companyId: string | null;
  person: {
    id: string;
    name: string;
    cpf: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  company: {
    id: string;
    companyName: string | null;
    cnpj: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
    companyRepresentatives: Array<{
      id: string;
      companyId: string;
      personId: string;
      createdAt: string;
      updatedAt: string;
      person: {
        id: string;
        name: string;
        cpf: string | null;
        email: string | null;
        phone: string | null;
        createdAt: string;
        updatedAt: string;
      } | null;
    }>;
  } | null;
};

export type FindInvitesResponse = {
  message: string;
  participant: InviteParticipant;
};

export async function findInvites(token: string) {
  const response = await api.get<FindInvitesResponse>(
    `/participants/invite/${token}`
  );

  return response.data;
}
