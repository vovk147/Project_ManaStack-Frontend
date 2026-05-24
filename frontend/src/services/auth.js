import api from './api';

export const authService = {
  login: (data) => api.post('auth/login/', data),
  logout: () => api.post('auth/logout/'),
  register: (data) => api.post('auth/register/', data),
  refreshToken: (refresh) => api.post('auth/token/refresh/', { refresh }),
  getProfile: (id) => api.get(`auth/profile/${id}/`),
  updateProfile: (id, data) => api.put(`auth/profile/${id}/`, data),
 // Внутри src/services/auth.js объект authService должен иметь этот метод:
patchProfile: (id, data) => api.patch(`auth/profile/${id}/`, data),
};