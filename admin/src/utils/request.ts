/**
 * HTTP 请求工具模块
 * 基于 axios 封装统一的请求实例，自动注入 token、处理 401 登录过期
 */
import axios from 'axios';
import { message } from 'antd';

/** 创建 axios 实例，基础路径 /api，超时 10 秒 */
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * 请求拦截器
 * 根据当前路径判断使用管理员 token 还是商家 token
 * 确保商家无法访问管理员接口，反之亦然
 */
request.interceptors.request.use((config) => {
  const isMerchant = window.location.pathname.startsWith('/merchant-portal');
  const token = isMerchant
    ? localStorage.getItem('merchant_token')
    : localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 响应拦截器
 * 处理 401 登录过期自动跳转登录页，网络错误统一提示
 * 根据当前路径判断跳转管理员登录还是商家登录
 */
request.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === 401) {
      message.error('登录已过期，请重新登录');
      const isMerchant = window.location.pathname.startsWith('/merchant-portal');
      if (isMerchant) {
        localStorage.removeItem('merchant_token');
        localStorage.removeItem('merchant');
        window.location.href = '/merchant-portal/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.href = '/login';
      }
      return Promise.reject(new Error('未登录'));
    }
    return data;
  },
  (error) => {
    message.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default request;
