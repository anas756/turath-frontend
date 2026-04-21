import axios from 'axios';

const backEndUrl = import.meta.env.VITE_BACK_END_URL;

if (!backEndUrl) {
  throw new Error('VITE_BACK_END_URL is not defined in environment variables');
}

export const customAxios = axios.create({
  baseURL: backEndUrl,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

customAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error or server unreachable:', error.message);
      return Promise.reject(
        new Error('Network error. Please check your connection.')
      );
    }

    const { status } = error.response;

    if (status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    if (status === 403) {
      console.warn('Access forbidden.');
    }

    if (status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);
