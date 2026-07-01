import request from './request';

// 商品分类
export const getCategoryList = () => request.get('/api/product-category/list');

// 商品
export const getProductList = (params) => request.get('/api/product/list', { params });
export const getProductDetail = (id) => request.get(`/api/product/detail/${id}`);

// 用户
export const userRegister = (data) => request.post('/api/user/register', data);
export const userLogin = (data) => request.post('/api/user/login', data);
export const getUserInfo = () => request.get('/api/user/info');
export const updateProfile = (data) => request.put('/api/user/update-profile', data);
export const updatePassword = (data) => request.put('/api/user/update-password', data);
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 购物车
export const getCartList = () => request.get('/api/cart/list');
export const addCartItem = (data) => request.post('/api/cart/add', data);
export const updateCartItem = (id, data) => request.put(`/api/cart/update/${id}`, data);
export const deleteCartItem = (id) => request.delete(`/api/cart/delete/${id}`);

// 收藏
export const toggleFavorite = (data) => request.post('/api/product-favorite/toggle', data);
export const getFavoriteList = () => request.get('/api/product-favorite/list');

// 订单
export const createOrder = (data) => request.post('/api/order/create', data);
export const getOrderList = (params) => request.get('/api/order/list', { params });
export const getOrderDetail = (id) => request.get(`/api/order/detail/${id}`);
export const updateOrderStatus = (id, data) => request.put(`/api/order/update-status/${id}`, data);
export const deleteOrder = (id) => request.delete(`/api/order/delete/${id}`);
export const requestCancelOrder = (id) => request.put(`/api/order/request-cancel/${id}`);
export const requestReturnOrder = (id) => request.put(`/api/order/request-return/${id}`);
export const revokeCancelOrder = (id) => request.put(`/api/order/revoke-cancel/${id}`);

// 客服聊天
export const sendChatMessage = (data) => request.post('/api/chat/send', data);
export const getChatConversation = (targetId, params) => request.get(`/api/chat/conversation/${targetId}`, { params });
export const getChatUnread = (targetId) => request.get(`/api/chat/unread/${targetId}`);

// 评价
export const createReview = (data) => request.post('/api/review/create', data);
export const getProductReviews = (productId, params) => request.get(`/api/review/product/${productId}`, { params });
export const getMyReviews = (params) => request.get('/api/review/my', { params });
