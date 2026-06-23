/**
 * 请求封装
 */

const BASE_URL = 'http://localhost:8001/open/client';

function getToken() {
  return wx.getStorageSync('token') || '';
}

function request(url, method = 'GET', data = {}, header = {}) {
  const token = getToken();
  return new Promise((resolve, reject) => {
    wx.request({
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
        if (res.statusCode === 200 && (body.code === 0 || body.code === 1000 || body.code === undefined)) {
          resolve(body.data ?? body);
        } else if (res.statusCode === 401) {
          // Token 过期，跳转登录
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.showToast({ title: '请先登录', icon: 'none' });
          resolve(null);
        } else {
          wx.showToast({ title: body.message || '请求失败', icon: 'none' });
          reject(body);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}

export const get = (url, data) => request(url, 'GET', data);
export const post = (url, data) => request(url, 'POST', data);
