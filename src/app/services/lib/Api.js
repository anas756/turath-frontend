import { customAxios } from './axios';

export const api = {
  // auth
  login: (data) => customAxios.post('/login', data),
  logout: () => customAxios.post('/logout'),
  register: (data) => customAxios.post('/register', data),

  // account confirmation
  confirmEmail: (email) =>
    customAxios.get(`/auth/email-verified/${email}`),
  resendConfirmation: (data) =>
    customAxios.post('/auth/resend-confirmation', data),

  // password
  sendResetLink: (emailData) =>
    customAxios.post('/auth/forgot-password', emailData),
  verifyResetToken: (email, token) =>
    customAxios.get(`/auth/verify-reset-token/${email}`, { params: { token } }),
  updatePassword: (data) => customAxios.post('/auth/reset-password', data),

  //  user
  getAllUsers: () => customAxios.get('/users'),
  updateUser: (id, data) => customAxios.put(`/users/${id}`, data),
  deleteUser: (id) => customAxios.delete(`/users/${id}`),

  // Categories
  getCategories: () => customAxios.get('/categories'),
  getCategorie: (id) => customAxios.get(`/categories/${id}`),
  createCategorie: (data) => customAxios.post('/categories', data),
  updateCategorie: (id, data) => customAxios.put(`/categories/${id}`, data),
  deleteCategorie: (id) => customAxios.delete(`/categories/${id}`),

  // books
  getBooks: () => customAxios.get('/book'),
  getBook: (id) => customAxios.get(`/book/${id}`),
  createBook: (data) => customAxios.post('/book', data),
  updateBook: (id, data) => customAxios.put(`/book/${id}`, data),
  deleteBook: (id) => customAxios.delete(`/book/${id}`),
  getBookContent: (book_id, page = 1) =>
    customAxios.get(`/books/${book_id}/pages`, { params: { page: page } }),

  // search
  searchInsideBook: (keyWord, book_id) =>
    customAxios.get(`/books/${book_id}/search`, {
      params: { key_word: keyWord },
    }),
  searchAbookUsingWord: (keyWord) =>
    customAxios.get('search/library', { params: { key_word: keyWord } }),
};
