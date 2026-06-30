import axios from 'axios';
import { message } from 'antd';

const api = axios.create({ baseURL: '/api/v1' });

// 请求拦截器 — 注入 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 — 统一错误处理
api.interceptors.response.use(
  (response) => {
    // 提取统一返回格式中的 data
    const body = response.data;
    if (body && body.code !== undefined) {
      if (body.code !== 200) {
        // 业务错误
        message.error(body.message || '请求失败');
        return Promise.reject(new Error(body.message));
      }
      // 返回内层 data
      response.data = body;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('admin_token');
          // 跳转到登录页（暂用简单重定向）
          window.location.href = '/login';
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 429:
          message.error('请求过于频繁，请稍后重试');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.message || '网络错误');
      }
    } else {
      message.error('网络连接失败，请检查网络');
    }
    return Promise.reject(error);
  }
);

/* ============================================================
   商品 API
   ============================================================ */
export const productApi = {
  list(params?: any) {
    return api.get('/products', { params }).then(res => res.data);
  },
  detail(id: number) {
    return api.get(`/products/${id}`).then(res => res.data);
  },
  create(data: any) {
    return api.post('/products', data).then(res => res.data);
  },
  update(id: number, data: any) {
    return api.put(`/products/${id}`, data).then(res => res.data);
  },
  delete(id: number) {
    return api.delete(`/products/${id}`).then(res => res.data);
  },
  categories() {
    return api.get('/products/categories').then(res => res.data);
  },
  skus(productId: number) {
    return api.get(`/products/${productId}/skus`).then(res => res.data);
  },
  reviews(productId: number, params?: any) {
    return api.get(`/products/${productId}/reviews`, { params }).then(res => res.data);
  },
};

/* ============================================================
   订单 API
   ============================================================ */
export const orderApi = {
  list(params?: any) {
    return api.get('/orders', { params }).then(res => res.data);
  },
  detail(id: number) {
    return api.get(`/orders/${id}`).then(res => res.data);
  },
  pay(id: number) {
    return api.post(`/orders/${id}/pay`).then(res => res.data);
  },
  cancel(id: number) {
    return api.post(`/orders/${id}/cancel`).then(res => res.data);
  },
  confirm(id: number) {
    return api.post(`/orders/${id}/confirm`).then(res => res.data);
  },
};

/* ============================================================
   分类 API
   ============================================================ */
/* ============================================================
   评价 API
   ============================================================ */
export const reviewApi = {
  list(params?: any) {
    return api.get('/reviews', { params }).then(res => res.data);
  },
  updateStatus(id: number, status: string) {
    return api.put(`/reviews/${id}/status`, { status }).then(res => res.data);
  },
  batchStatus(ids: number[], status: string) {
    return api.post('/reviews/batch/status', { ids, status }).then(res => res.data);
  },
  batchDelete(ids: number[]) {
    return api.post('/reviews/batch/delete', { ids }).then(res => res.data);
  },
  reply(id: number, reply: string) {
    return api.put(`/reviews/${id}/reply`, { reply }).then(res => res.data);
  },
  delete(id: number) {
    return api.delete(`/reviews/${id}`).then(res => res.data);
  },
};

/* ============================================================
   餐饮 API
   ============================================================ */
export const foodApi = {
  // 餐厅
  listRestaurants(params?: any) { return api.get('/restaurants', { params }).then(res => res.data); },
  allRestaurants() { return api.get('/restaurants/all').then(res => res.data); },
  createRestaurant(data: any) { return api.post('/restaurants', data).then(res => res.data); },
  updateRestaurant(id: number, data: any) { return api.put(`/restaurants/${id}`, data).then(res => res.data); },
  deleteRestaurant(id: number) { return api.delete(`/restaurants/${id}`).then(res => res.data); },
  // 农产品
  listProducts(params?: any) { return api.get('/food-products', { params }).then(res => res.data); },
  createProduct(data: any) { return api.post('/food-products', data).then(res => res.data); },
  updateProduct(id: number, data: any) { return api.put(`/food-products/${id}`, data).then(res => res.data); },
  deleteProduct(id: number) { return api.delete(`/food-products/${id}`).then(res => res.data); },
  // 菜品
  listDishes(params?: any) { return api.get('/dishes', { params }).then(res => res.data); },
  createDish(data: any) { return api.post('/dishes', data).then(res => res.data); },
  updateDish(id: number, data: any) { return api.put(`/dishes/${id}`, data).then(res => res.data); },
  deleteDish(id: number) { return api.delete(`/dishes/${id}`).then(res => res.data); },
};

export const categoryApi = {
  list() {
    return api.get('/products/categories').then(res => res.data);
  },
  create(data: any) {
    return api.post('/products/categories', data).then(res => res.data);
  },
  update(id: number, data: any) {
    return api.put(`/products/categories/${id}`, data).then(res => res.data);
  },
  delete(id: number) {
    return api.delete(`/products/categories/${id}`).then(res => res.data);
  },
};

export default api;
