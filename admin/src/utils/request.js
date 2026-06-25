import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    } else {
      message.error(err.response?.data?.message || '请求失败');
    }
    return Promise.reject(err);
  }
);

export default instance;
