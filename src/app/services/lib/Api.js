import { customAxios } from './axios';

export const api = {
  // --- Auth & Account ---
  login: (data) => customAxios.post('/login', data),
  logout: () => customAxios.post('/logout'),
  register: (data) => customAxios.post('/register', data),
  getProfile: () => customAxios.get('/auth/profile'),

  confirmEmail: (email) => customAxios.get(`/auth/email-verified/${email}`),
  resendConfirmation: (data) =>
    customAxios.post('/auth/resend-confirmation', data),

  // --- Password ---
  sendResetLink: (emailData) =>
    customAxios.post('/auth/forgot-password', emailData),
  verifyResetToken: (email, token) =>
    customAxios.get(`/auth/verify-reset-token/${email}`, { params: { token } }),
  updatePassword: (data) => customAxios.post('/auth/reset-password', data),

  // --- Users ---
  getAllUsers: () => customAxios.get('/users'),
  getUser: (id) => customAxios.get(`/users/${id}`),
  updateUser: ({ id, data }) => customAxios.put(`/users/${id}`, data),
  deleteUser: (id) => customAxios.delete(`/users/${id}`),

  // --- Categories ---
  getCategories: () => customAxios.get('/categories'),
  getCategorie: (id) => customAxios.get(`/categories/${id}`),
  createCategorie: (data) => customAxios.post('/categories', data),
  updateCategorie: (id, data) => customAxios.put(`/categories/${id}`, data),
  deleteCategorie: (id) => customAxios.delete(`/categories/${id}`),

  // --- Books (Fixed routes) ---
  getDocs: () => customAxios.get('/library/docs'),
  getDoc: (id) => customAxios.get(`/library/docs/${id}`),
  createDoc: (data) => customAxios.post('/library/docs', data),
  updateDoc: (id, data) => customAxios.put(`/library/docs/${id}`, data),
  deleteDoc: (id) => customAxios.delete(`/library/docs/${id}`),

  // Content & Search
  getDocContent: (id, page = 1) =>
    customAxios.get(`/library/docs/${id}/pages`, { params: { page } }),
  searchInsideDoc: (keyWord, id) =>
    customAxios.get(`/library/docs/${id}/search`, {
      params: { key_word: keyWord },
    }),
  searchAbookUsingWord: (keyWord) =>
    customAxios.get('/search/library', { params: { key_word: keyWord } }),

  // --- Media ---
  getMedia: (filters = {}) => customAxios.get('/media', { params: filters }),
  getMediaById: (id) => customAxios.get(`/media/${id}`),

  createMedia: (data) => customAxios.post('/media', data),

  // FIX: Change to POST because of FormData + _method: 'PUT'
  updateMedia: (id, data) => customAxios.post(`/media/${id}`, data),

  // FIX: Ensure ID is correctly interpolated
  deleteMedia: (id) => customAxios.delete(`/media/${id}`),

  bulkDeleteMedia: (ids) => customAxios.post('/media/bulk-delete', { ids }),

  updateMediaStatus: (id, status) =>
    customAxios.put(`/media/${id}/status`, { status }),
};
