import { api } from '@/lib/axios';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export async function authenticateUser({
  email,
  password,
}: AuthenticateUserRequest) {
  const response = await api.post('/user/authenticate', {
    email,
    password,
  });

  console.log(response);

  return response;
}
