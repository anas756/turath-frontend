import { customAxios } from './axios';

export const api = {
  // AUTH 
  login: (data) => customAxios.post('/login', data),
  logout: () => customAxios.post('/logout'),
  register: (data) => customAxios.post('/register', data),

  // ACOUNT CONFIRMATION
  confirmEmail: (email) => customAxios.get(`/auth/email-confirm/${email}`),
  resendConfirmation: (data) =>
    customAxios.post('/auth/resend-confirmation', data),

  // PASSWORD 
  sendResetLink: (emailData) =>
    customAxios.post('/auth/forgot-password', emailData),
  verifyResetToken: (email, token) =>
    customAxios.get(`/auth/verify-reset-token/${email}`, { params: { token } }),
  updatePassword: (data) => customAxios.post('/auth/reset-password', data),

  //  USER CRUD
  getAllUsers: () => customAxios.get('/users'),
  updateUser: (id, data) => customAxios.put(`/users/${id}`, data),
  deleteUser: (id) => customAxios.delete(`/users/${id}`),
};
