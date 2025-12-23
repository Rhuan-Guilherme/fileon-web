import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.request.use(async (config) => {
  await delay(1000);

  return config;
});
