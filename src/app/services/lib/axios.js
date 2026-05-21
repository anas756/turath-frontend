import axios from 'axios';
import Cookies from 'js-cookie';
const backEndUrl = import.meta.env.VITE_BACK_END_URL;
const secret_key = import.meta.env.VITE_API_SECRET;

if (!backEndUrl && !secret_key) {
  throw new Error('VITE_BACK_END_URL is not defined in environment variables');
}

export const customAxios = axios.create({
  baseURL: backEndUrl,
  // timeout: 10_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

customAxios.interceptors.request.use(
  async (config) => {
    const cookie = Cookies.get('jwt_token');
    if (cookie && cookie.value) {
      config.headers.Authorization = `Bearer ${cookie.value}`;
    }
    config.headers['X-App-Secret'] = secret_key;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
