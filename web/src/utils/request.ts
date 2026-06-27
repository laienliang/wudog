/* ============================================================
   Axios 请求封装 — 统一拦截、loading、错误处理
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\utils\request.ts
   ============================================================ */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 响应拦截
request.interceptors.response.use(
  (res: AxiosResponse) => {
    const { code, message: msg, data } = res.data || {};
    if (code === 200) return data;
    if (code === 401) {
      message.warning('请先登录');
      return Promise.reject(new Error(msg || '未登录'));
    }
    message.error(msg || '请求失败');
    return Promise.reject(new Error(msg || '请求失败'));
  },
  (err) => {
    if (err.response?.status === 401) {
      message.warning('请先登录');
    } else if (err.response?.status === 500) {
      message.error('服务器内部错误');
    } else if (err.code === 'ECONNABORTED') {
      message.error('请求超时');
    } else {
      message.error(err.message || '网络错误');
    }
    return Promise.reject(err);
  }
);

/** GET 请求 */
export async function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, { params, ...config }) as any;
}

/** POST 请求 */
export async function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config) as any;
}

/** PUT 请求 */
export async function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.put(url, data, config) as any;
}

/** DELETE 请求 */
export async function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete(url, config) as any;
}

export default request;
