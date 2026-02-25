import { api } from '@/lib/axios';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  tenantId: string;
  role: 'ADMIN' | 'GERENTE' | 'CORRETOR' | 'CORRESPONDENTE';
  cpf: string;
}

export function registerUser({
  name,
  email,
  password,
  tenantId,
  role,
  cpf,
}: RegisterUserRequest) {
  return api.post('/user/register', {
    name,
    email,
    password,
    tenantId,
    role,
    cpf,
  });
}
