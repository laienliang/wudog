const BASE_URL = 'http://127.0.0.1:3000';

function request(url, method = 'GET', data = {}) {
  const app = getApp();
  const token = app?.globalData?.token || wx.getStorageSync('token') || '';

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      success: res => {
        if (res.data.code === 200) {
          resolve(res.data);
        } else if (res.data.code === 401) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          if (app) {
            app.globalData.token = '';
            app.globalData.userInfo = null;
          }
          wx.navigateTo({ url: '/pages/login/login' });
          reject(res.data);
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: err => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
}

function uploadFile(filePath) {
  const app = getApp();
  const token = app?.globalData?.token || wx.getStorageSync('token') || '';

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: BASE_URL + '/api/upload/image',
      filePath,
      name: 'file',
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      success: res => {
        const data = JSON.parse(res.data);
        if (data.code === 200) {
          resolve(data);
        } else {
          wx.showToast({ title: data.message || '上传失败', icon: 'none' });
          reject(data);
        }
      },
      fail: err => {
        wx.showToast({ title: '上传失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

module.exports = { request, uploadFile };
