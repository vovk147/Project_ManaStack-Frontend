import api from './api';

export const socialService = {
  // Комментарии
  getComments: () => api.get('comments/'),
  createComment: (data) => api.post('comments/', data),
  getComment: (id) => api.get(`comments/${id}/`),
  updateComment: (id, data) => api.put(`comments/${id}/`, data),
  deleteComment: (id) => api.delete(`comments/${id}/`),
  getMyComments: () => api.get('comments/my-comment/'),
  getPostComments: (postId) => api.get(`comments/post/${postId}/`),
  getReplies: (commentId) => api.get(`comments/${commentId}/replies/`),

  // Подписки
  getFollowers: () => api.get('followers/'),
  follow: (userId) => api.post('followers/', { user_id: userId }),
  unfollow: (userId) => api.delete(`followers/destroy/${userId}/`),
  getFeedFromSubscribers: () => api.get('followers/posts_from_subscribers/'),
};