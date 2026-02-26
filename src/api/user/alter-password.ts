import { api } from '@/lib/axios';

interface AlterPasswordRequest {
  email: string;
  password: string;
  newPassword: string;
}

export async function alterPassword({
  email,
  password,
  newPassword,
}: AlterPasswordRequest) {
  const response = await api.put('/user/alter-password', {
    email,
    password,
    newPassword,
  });

  return response.data;
}
