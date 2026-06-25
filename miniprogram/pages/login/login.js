Page({
  data: { username: '', password: '' },
  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  handleLogin() {
    if (!this.data.username || !this.data.password) {
      wx.showToast({ title: '请输入用户名和密码', icon: 'none' });
      return;
    }
    wx.request({
      url: 'http://localhost:3000/admin/login',
      method: 'POST',
      data: { username: this.data.username, password: this.data.password },
      success(res) {
        if (res.data.code === 200) {
          wx.setStorageSync('token', res.data.data.token);
          wx.switchTab({ url: '/pages/index/index' });
        } else {
          wx.showToast({ title: res.data.message, icon: 'none' });
        }
      },
    });
  },
});
