import api from './api';

export const postService = {
  getPosts: () => api.get('posts/'),
  createPost: (data) => api.post('posts/', data),
  getPostBySlug: (slug) => api.get(`posts/${slug}/`),
  updatePost: (slug, data) => api.put(`posts/${slug}/`, data),
  patchPost: (slug, data) => api.patch(`posts/${slug}/`, data),
  deletePost: (slug) => api.delete(`posts/${slug}/`),
  
  getPopular: () => api.get('posts/popular/'),
  getRecent: () => api.get('posts/recent/'),
  getMyPosts: () => api.get('posts/my-posts/'),
  getTags: () => api.get('posts/tag/'),

  getCategories: () => api.get('posts/categories/'),
  createCategory: (data) => api.post('posts/categories/', data),
  getCategoryPosts: (slug) => api.get(`posts/categories/${slug}/posts/`),
};