const { request } = require('./request');

async function login(phone, password) {
  const result = await request({
    url: '/app/user/login/password',
    method: 'POST',
    data: { phone, password },
  });
  wx.setStorageSync('wudong-app-token', result.token);
  return result;
}

function logout() {
  wx.removeStorageSync('wudong-app-token');
}

function getToken() {
  return wx.getStorageSync('wudong-app-token');
}

module.exports = {
  login,
  logout,
  getToken,
};
