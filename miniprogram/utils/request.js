const BASE_URL = 'http://127.0.0.1:3000';

function request(opts) {
  const url = BASE_URL + (opts.url || '');
  const method = opts.method || 'GET';
  const data = opts.data || {};
  const showLoading = opts.showLoading || false;

  if (showLoading) {
    wx.showLoading({ title: '加载中...', mask: true });
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        if (showLoading) wx.hideLoading();
        const body = res.data;
        if (res.statusCode === 200 && body && body.code === 0) {
          resolve(body.data);
        } else if (res.statusCode === 401) {
          wx.showToast({ title: '请先登录', icon: 'none' });
          reject(new Error('未登录'));
        } else {
          wx.showToast({ title: (body && body.message) || '请求失败', icon: 'none' });
          reject(new Error((body && body.message) || '请求失败'));
        }
      },
      fail: function (err) {
        if (showLoading) wx.hideLoading();
        wx.showToast({ title: '网络异常，请检查后端服务', icon: 'none' });
        reject(err);
      },
    });
  });
}

function get(url, data) {
  return request({ url: url, method: 'GET', data: data });
}

function post(url, data) {
  return request({ url: url, method: 'POST', data: data, showLoading: true });
}

function put(url, data) {
  return request({ url: url, method: 'PUT', data: data, showLoading: true });
}

function del(url, data) {
  return request({ url: url, method: 'DELETE', data: data });
}

module.exports = { request: request, get: get, post: post, put: put, del: del, BASE_URL: BASE_URL };
