/**
 * 请求封装
 */

const BASE_URL = 'http://localhost:8001/api/open';

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
        if (res.statusCode === 200 && res.data.code === 0) {
          resolve(res.data.data);
        } else if (res.statusCode === 401) {
          // Token 过期，跳转登录
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.showToast({ title: '请先登录', icon: 'none' });
          resolve(null);
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
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
