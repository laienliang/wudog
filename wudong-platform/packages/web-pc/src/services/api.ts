import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

export const productApi = {
  list(params?: any) { return api.get('/products', { params }); },
  detail(id: number) { return api.get(`/products/${id}`); },
  categories() { return api.get('/products/categories'); },
  skus(productId: number) { return api.get(`/products/${productId}/skus`); },
  reviews(productId: number, params?: any) { return api.get(`/products/${productId}/reviews`, { params }); },
};

export const orderApi = {
  create(data: any) { return api.post('/orders', data); },
  list(params?: any) { return api.get('/orders', { params }); },
};
