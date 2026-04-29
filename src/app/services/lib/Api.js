import { customAxios } from './axios';
export const api = {
  login: (data) => customAxios.post('/login', data),
  logout: () => customAxios.post('/logout'),
};
