import { request } from '../../utils/request';

Page({
  data: {
    username: '',
    password: '',
    loading: false,
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({ url: '/pages/index/index' }).catch(() => {
        wx.redirectTo({ url: '/pages/index/index' });
      });
    }
  },

  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },

  async onLogin() {
    const { username, password } = this.data;
    if (!username.trim() || !password.trim()) {
      return wx.showToast({ title: '请输入用户名和密码', icon: 'none' });
    }
    this.setData({ loading: true });
    try {
      const res = await request('/public/auth/login', 'POST', { username, password });
      wx.setStorageSync('token', res.data.token);
      // 解码JWT存储用户信息
      try {
        const payload = JSON.parse(decodeURIComponent(
          res.data.token.split('.')[1].replace(/[-_]/g, c => c === '-' ? '+' : '/').split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        ));
        wx.setStorageSync('userId', payload.userId || payload.id);
        wx.setStorageSync('username', payload.username || username);
      } catch {}
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' }).catch(() => {
          wx.redirectTo({ url: '/pages/index/index' });
        });
      }, 800);
    } catch {
      wx.showToast({ title: '用户名或密码错误', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
