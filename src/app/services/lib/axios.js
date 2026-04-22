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
  async (config) => {
    const cookie = await cookieStore.get('jwt_token');
    if (cookie && cookie.value) {
      config.headers.Authorization = `Bearer ${cookie.value}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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
