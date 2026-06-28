const app = getApp();

function request({ url, method = 'GET', data, withToken = false }) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('wudong-app-token');

    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method,
      data,
      header: {
        'content-type': 'application/json',
        ...(withToken && token ? { Authorization: token } : {}),
      },
      success: response => {
        console.log('[request]', method, url, '-> status:', response.statusCode);
        const body = response.data || {};
        if (body.code === 1000) {
          resolve(body.data);
          return;
        }
        console.warn('[request] 接口返回非1000:', body.code, body.message);
        reject(new Error(body.message || '请求失败'));
      },
      fail: error => {
        console.error('[request] 网络请求失败:', JSON.stringify(error));
        reject(new Error(error.errMsg || error.message || '网络请求失败'));
      },
    });
  });
}

module.exports = {
  request,
};
