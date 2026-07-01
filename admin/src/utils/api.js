import request from './request';

// 管理员登录
export const adminLogin = (data) => request.post('/api/admin/login', data);

// 商品分类
export const getCategoryList = () => request.get('/api/product-category/list');
export const createCategory = (data) => request.post('/api/product-category/create', data);
export const updateCategory = (id, data) => request.put(`/api/product-category/update/${id}`, data);
export const deleteCategory = (id) => request.delete(`/api/product-category/delete/${id}`);

// 商品
export const getProductList = (params) => request.get('/api/product/list', { params });
export const createProduct = (data) => request.post('/api/product/create', data);
export const updateProduct = (id, data) => request.put(`/api/product/update/${id}`, data);
export const deleteProduct = (id) => request.delete(`/api/product/delete/${id}`);
export const toggleProductStatus = (id) => request.put(`/api/product/toggle-status/${id}`);

// SKU
export const getSkuList = (productId) => request.get('/api/product-sku/list', { params: { productId } });
export const createSku = (data) => request.post('/api/product-sku/create', data);
export const updateSku = (id, data) => request.put(`/api/product-sku/update/${id}`, data);
export const deleteSku = (id) => request.delete(`/api/product-sku/delete/${id}`);

// 图片
export const getImageList = (productId) => request.get('/api/product-image/list', { params: { productId } });
export const createImage = (data) => request.post('/api/product-image/create', data);
export const deleteImage = (id) => request.delete(`/api/product-image/delete/${id}`);
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 订单
export const getOrderList = (params) => request.get('/api/order/list', { params });
export const getOrderDetail = (id) => request.get(`/api/order/detail/${id}`);
export const updateOrderStatus = (id, data) => request.put(`/api/order/update-status/${id}`, data);
export const approveCancelOrder = (id) => request.put(`/api/order/approve-cancel/${id}`);
export const rejectCancelOrder = (id) => request.put(`/api/order/reject-cancel/${id}`);

// 客服聊天
export const sendChatMessage = (data) => request.post('/api/chat/send', data);
export const getChatConversation = (targetId, params) => request.get(`/api/chat/conversation/${targetId}`, { params });
export const getAdminConversations = () => request.get('/api/chat/admin/conversations');

// 评价管理
export const getReviewList = (params) => request.get('/api/review/list', { params });
export const replyReview = (id, data) => request.put(`/api/review/reply/${id}`, data);
export const deleteReview = (id) => request.delete(`/api/review/delete/${id}`);
