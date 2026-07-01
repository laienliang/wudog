const { request } = require('./request');

// 分类
const getCategoryList = () => request('/api/product-category/list');

// 商品
const getProductList = (params) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}=${v}`).join('&');
  return request(`/api/product/list?${query}`);
};
const getProductDetail = (id) => request(`/api/product/detail/${id}`);

// 用户
const register = (data) => request('/api/user/register', 'POST', data);
const login = (data) => request('/api/user/login', 'POST', data);
const getUserInfo = () => request('/api/user/info');
const updateProfile = (data) => request('/api/user/update-profile', 'PUT', data);
const updatePassword = (data) => request('/api/user/update-password', 'PUT', data);

// 购物车
const getCartList = () => request('/api/cart/list');
const addToCart = (data) => request('/api/cart/add', 'POST', data);
const updateCartItem = (id, data) => request(`/api/cart/update/${id}`, 'PUT', data);
const deleteCartItem = (id) => request(`/api/cart/delete/${id}`, 'DELETE');

// 收藏
const toggleFavorite = (data) => request('/api/product-favorite/toggle', 'POST', data);
const getFavoriteList = () => request('/api/product-favorite/list');

// 订单
const createOrder = (data) => request('/api/order/create', 'POST', data);
const getOrderList = (params) => {
  const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}=${v}`).join('&');
  return request(`/api/order/list?${query}`);
};
const getOrderDetail = (id) => request(`/api/order/detail/${id}`);
const requestCancelOrder = (id) => request(`/api/order/request-cancel/${id}`, 'PUT');
const requestReturnOrder = (id) => request(`/api/order/request-return/${id}`, 'PUT');
const revokeCancelOrder = (id) => request(`/api/order/revoke-cancel/${id}`, 'PUT');

// 客服聊天
const sendChatMessage = (data) => request('/api/chat/send', 'POST', data);
const getChatConversation = (targetId) => request(`/api/chat/conversation/${targetId}`);
const getChatUnread = (targetId) => request(`/api/chat/unread/${targetId}`);

// 评价
const createReview = (data) => request('/api/review/create', 'POST', data);
const getProductReviews = (productId) => request(`/api/review/product/${productId}`);
const getMyReviews = () => request('/api/review/my');

// 地址
const getAddressList = () => request('/api/address/list');
const createAddress = (data) => request('/api/address/create', 'POST', data);
const updateAddress = (id, data) => request(`/api/address/update/${id}`, 'PUT', data);
const deleteAddress = (id) => request(`/api/address/delete/${id}`, 'DELETE');
const setDefaultAddress = (id) => request(`/api/address/set-default/${id}`, 'PUT');

module.exports = {
  getCategoryList,
  getProductList,
  getProductDetail,
  register,
  login,
  getUserInfo,
  updateProfile,
  updatePassword,
  getCartList,
  addToCart,
  updateCartItem,
  deleteCartItem,
  toggleFavorite,
  getFavoriteList,
  createOrder,
  getOrderList,
  getOrderDetail,
  requestCancelOrder,
  requestReturnOrder,
  revokeCancelOrder,
  sendChatMessage,
  getChatConversation,
  getChatUnread,
  createReview,
  getProductReviews,
  getMyReviews,
  getAddressList,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
