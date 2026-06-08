import axios from 'axios';
import Cookies from 'js-cookie';

const backEndUrl = import.meta.env.VITE_BACK_END_URL;
const secret_key = import.meta.env.VITE_API_SECRET;

if (!backEndUrl || !secret_key) {
  throw new Error(
    'VITE_BACK_END_URL or VITE_API_SECRET is not defined in environment variables'
  );
}

export const customAxios = axios.create({
  baseURL: backEndUrl,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

customAxios.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('jwt_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['X-App-Secret'] = secret_key;

 if (!(config.data instanceof FormData)) {
   config.headers['Content-Type'] = 'application/json';
 } else {
   delete config.headers['Content-Type'];
 }

    return config;
  },
  (error) => Promise.reject(error)
);

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      Cookies.remove('jwt_token');

      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login?message=unauthorized';
      }
    }

    return Promise.reject(error);
  }
);
