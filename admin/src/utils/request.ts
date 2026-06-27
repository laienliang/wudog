/* ============================================================
   管理后台 Axios 封装 — 自动携带 Authorization
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\utils\request.ts
   ============================================================ */
import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截 — 自动注入 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截
request.interceptors.response.use(
  (res: AxiosResponse) => {
    const { code, message: msg, data } = res.data || {};
    if (code === 200) return data;
    if (code === 401) {
      localStorage.removeItem('admin_token');
      message.error('登录已过期，请重新登录');
      window.location.href = '/login';
      return Promise.reject(new Error('未登录'));
    }
    message.error(msg || '请求失败');
    return Promise.reject(new Error(msg));
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    } else {
      message.error(err.message || '网络错误');
    }
    return Promise.reject(err);
  }
);

export async function get<T = any>(url: string, params?: any): Promise<T> {
  return request.get(url, { params }) as any;
}
export async function post<T = any>(url: string, data?: any): Promise<T> {
  return request.post(url, data) as any;
}
export async function put<T = any>(url: string, data?: any): Promise<T> {
  return request.put(url, data) as any;
}
export async function del<T = any>(url: string): Promise<T> {
  return request.delete(url) as any;
}
export async function patch<T = any>(url: string, data?: any): Promise<T> {
  return request.patch(url, data) as any;
}
export default request;
