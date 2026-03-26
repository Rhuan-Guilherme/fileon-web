import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: 'https://lvh.me:3333',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const isAuthPage = window.location.pathname === '/sign-in';

    const isAuthRequest =
      originalRequest.url?.includes('/user/refresh') ||
      originalRequest.url?.includes('/user/logout');

    if (isAuthPage || isAuthRequest) {
      return Promise.reject(error);
    }

    if (
      (error.response.status === 403 &&
        error.response.data.message === 'Unauthorized') ||
      error.response.data.message === 'User is not active'
    ) {
      toast.error(
        'Conta bloqueada. Entre em contato com o suporte da sua empresa.'
      );
      await api.post('/user/logout');
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 3000);
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get('/user/refresh');

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.request.use(async (config) => {
  await delay(500);

  return config;
});
