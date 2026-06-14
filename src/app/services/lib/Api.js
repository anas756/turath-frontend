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
  getAllUsers: (params = {}) => customAxios.get('/users', { params }),
  getUser: (id) => customAxios.get(`/users/${id}`),
  updateUser: ({ id, data }) => customAxios.put(`/users/${id}`, data),
  deleteUser: (id) => customAxios.delete(`/users/${id}`),

  // --- Categories ---
  getCategories: (params = {}) => customAxios.get('/categories', { params }),
  getCategorie: (id) => customAxios.get(`/categories/${id}`),
  createCategorie: (data) => customAxios.post('/categories', data),
  updateCategorie: (id, data) =>
    data instanceof FormData
      ? customAxios.post(`/categories/${id}`, data)
      : customAxios.put(`/categories/${id}`, data),
  deleteCategorie: (id) => customAxios.delete(`/categories/${id}`),

  // --- Books (Fixed routes) ---
  getDocs: (params = {}) => customAxios.get('/library/docs', { params }),
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
  searchAbookUsingWord: (keyWord, params = {}) =>
    customAxios.get('/search/library', {
      params: { key_word: keyWord, ...params },
    }),
  searchPublic: ({ query, type = 'all' }) =>
    customAxios.get('/search/public', { params: { q: query, type } }),

  // --- Media ---
  getMedia: (filters = {}) => customAxios.get('/media', { params: filters }),
  getMediaById: (id) => customAxios.get(`/media/${id}`),

  createMedia: (data) => customAxios.post('/media', data),

  updateMedia: (id, data) => {
    if (data instanceof FormData) {
      if (!data.has('_method')) data.append('_method', 'PUT');
      return customAxios.post(`/media/${id}`, data);
    }

    return customAxios.put(`/media/${id}`, data);
  },

  // FIX: Ensure ID is correctly interpolated
  deleteMedia: (id) => customAxios.delete(`/media/${id}`),

  bulkDeleteMedia: (ids) => customAxios.post('/media/bulk-delete', { ids }),

  updateMediaStatus: (id, status) =>
    customAxios.put(`/media/${id}/status`, { status }),
  getDashboardStats: () => customAxios.get('/dashboard/stats'),

  // --- Favorites ---
  getFavorites: () => customAxios.get('/favorites'),
  addDocumentFavorite: (favorableId) =>
    customAxios.post('/favorites/document', { favorable_id: favorableId }),
  addMediaFavorite: (favorableId) =>
    customAxios.post('/favorites/media', { favorable_id: favorableId }),
  removeFavorite: (type, favorableId) =>
    customAxios.delete(`/favorites/${type}/${favorableId}`),

  getLandingPreview: (params = {}) => customAxios.get('/landing/preview', { params }),
};
