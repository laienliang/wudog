/**
 * 请求封装
 */

const DEFAULT_BASE_URL = 'http://localhost:8001/open/client';
const BASE_URL = (import.meta.env.VITE_APP_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

function getToken() {
  return uni.getStorageSync('token') || '';
}

function request(url, method = 'GET', data = {}, header = {}) {
  const token = getToken();
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'Client-Type': 'miniprogram',
        ...header,
      },
      success(res) {
        const body = res.data || {};
        if (res.statusCode === 200 && (body.code === 0 || body.code === undefined)) {
          resolve(body.data ?? body);
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          uni.showToast({ title: '请先登录', icon: 'none' });
          resolve(null);
        } else {
          uni.showToast({ title: body.message || '请求失败', icon: 'none' });
          reject(body);
        }
      },
      fail(err) {
        uni.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}

export const get = (url, data) => request(url, 'GET', data);
export const post = (url, data) => request(url, 'POST', data);
export const apiBaseUrl = BASE_URL;
