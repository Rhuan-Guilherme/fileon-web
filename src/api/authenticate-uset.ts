import { api } from '@/lib/axios';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export function authenticateUser({ email, password }: AuthenticateUserRequest) {
  return api.post('/user/authenticate', {
    email,
    password,
  });
}
