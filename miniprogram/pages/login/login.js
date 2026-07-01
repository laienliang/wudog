const { login, register } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    isLogin: true,
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    submitting: false,
  },

  switchMode() {
    this.setData({ isLogin: !this.data.isLogin });
  },

  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onConfirmPasswordInput(e) { this.setData({ confirmPassword: e.detail.value }); },
  onNicknameInput(e) { this.setData({ nickname: e.detail.value }); },

  async onSubmit() {
    const { isLogin, username, password, confirmPassword, nickname } = this.data;
    if (!username.trim()) {
      wx.showToast({ title: '请输入用户名', icon: 'none' }); return;
    }
    if (!password.trim() || password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' }); return;
    }

    this.setData({ submitting: true });
    try {
      if (isLogin) {
        const res = await login({ username: username.trim(), password });
        app.globalData.token = res.data.token;
        app.globalData.userInfo = res.data.user;
        wx.setStorageSync('token', res.data.token);
        wx.setStorageSync('userInfo', res.data.user);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1000);
      } else {
        if (password !== confirmPassword) {
          wx.showToast({ title: '两次密码不一致', icon: 'none' }); return;
        }
        await register({ username: username.trim(), password, nickname: nickname.trim() });
        wx.showToast({ title: '注册成功', icon: 'success' });
        this.setData({ isLogin: true });
      }
    } catch {}
    finally { this.setData({ submitting: false }); }
  },
});
