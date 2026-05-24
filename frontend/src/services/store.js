import api from './api';

export const storeService = {
  getStoreItems: () => api.get('store/'),
  getPostList: () => api.get('store/get_post_list/'),
  getInventory: () => api.get('store/inventory/'),
  addToInventory: (data) => api.post('store/inventory/', data),
  getInventoryHistory: () => api.get('store/inventory/history/'),
  
  // Механики закрепов и отправки маны
  getPinnedPost: () => api.get('store/penned_post/'),
  deletePinnedPost: () => api.delete('store/penned_post/'),
  pinPost: (postId) => api.post('store/pin_post/', { post_id: postId }),
  unpinPost: (postId) => api.post('store/unpin_post/', { post_id: postId }),
  sendMana: (recipientId, amount) => api.post('store/send_mana/', { recipient_id: recipientId, amount }),
};