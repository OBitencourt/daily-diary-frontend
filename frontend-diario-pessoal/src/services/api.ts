import axios from 'axios';
import type { InternalAxiosRequestConfig }  from 'axios'
const api = axios.create({
  baseURL: '/api',
});

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getCookie('sentia_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
