import { api } from '@/lib/axios';

export type ProcessStatus =
  | 'NOVO'
  | 'DOCUMENTACAO_PENDENTE'
  | 'DOCUMENTACAO_COMPLETA'
  | 'EM_ANALISE'
  | 'FINALIZADO'
  | 'CANCELADO';

export type ProcessType = 'NOVO' | 'PLANTA' | 'INDIVIDUAL';

export type ParticipantType = 'COMPRADOR' | 'VENDEDOR';

export interface ParticipantInvite {
  id: string;
  participantId: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRepresentative {
  id: string;
  companyId: string;
  personId: string;
  createdAt: string;
  updatedAt: string;
  person: Person;
}

export interface Company {
  id: string;
  companyName: string | null;
  cnpj: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  companyRepresentatives: CompanyRepresentative[];
}

export interface Participant {
  id: string;
  processId: string;
  type: ParticipantType;
  createdAt: string;
  updatedAt: string;

  personId: string | null;
  companyId: string | null;

  person: Person | null;
  company: Company | null;

  participantInvites: ParticipantInvite[];
}

export interface Process {
  id: string;
  tenantId: string;
  name: string;
  vgv: number | null;
  status: ProcessStatus;
  type: ProcessType;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

export async function findProcess(processId: string) {
  const { data } = await api.get<Process>(`/processes/${processId}`);
  return data;
}
