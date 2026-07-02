const BASE_URL = 'http://127.0.0.1:3000';

function request(opts) {
  const url = BASE_URL + (opts.url || '');
  const method = opts.method || 'GET';
  const data = opts.data || {};
  const showLoading = opts.showLoading || false;
  const silent = opts.silent || false; // 静默模式：不自动弹 toast，由调用方处理错误

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
        if (res.statusCode === 200 && body && body.code === 200) {
          resolve(body.data);
        } else if (res.statusCode === 401) {
          if (!silent) wx.showToast({ title: '请先登录', icon: 'none' });
          reject(new Error('未登录'));
        } else {
          const errMsg = (body && body.message) || '请求失败';
          if (!silent) wx.showToast({ title: errMsg, icon: 'none', duration: 2500 });
          reject(new Error(errMsg));
        }
      },
      fail: function (err) {
        if (showLoading) wx.hideLoading();
        const msg = '网络异常，请检查后端服务';
        if (!silent) wx.showToast({ title: msg, icon: 'none' });
        reject(new Error(msg));
      },
    });
  });
}

function get(url, data) {
  return request({ url: url, method: 'GET', data: data });
}

function post(url, data) {
  // POST 请求默认 silent:true，由业务页面自行展示结果
  return request({ url: url, method: 'POST', data: data, showLoading: true, silent: true });
}

function put(url, data) {
  return request({ url: url, method: 'PUT', data: data, showLoading: true, silent: true });
}

function del(url, data) {
  return request({ url: url, method: 'DELETE', data: data });
}

module.exports = { request: request, get: get, post: post, put: put, del: del, BASE_URL: BASE_URL };
