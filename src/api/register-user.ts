import { api } from '@/lib/axios';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export function registerUser({ name, email, password }: RegisterUserRequest) {
  return api.post('/user/register', {
    name,
    email,
    password,
  });
}
