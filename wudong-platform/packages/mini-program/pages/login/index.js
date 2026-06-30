const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { phone: '13800138001', password: 'abc12345', loading: false },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onPwdInput(e) { this.setData({ password: e.detail.value }); },
  async onLogin() {
    const { phone, password } = this.data;
    if (!phone || !password) { wx.showToast({ title: '请输入手机号和密码', icon: 'none' }); return; }
    this.setData({ loading: true });
    try {
      const res = await new Promise((resolve, reject) => wx.request({
        url: BASE + '/auth/login', method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: { phone, password }, success: resolve, fail: reject,
      }));
      const data = res.data?.data || res.data;
      if (data.accessToken) {
        wx.setStorageSync('token', data.accessToken);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1000);
      } else {
        wx.showToast({ title: '手机号或密码错误', icon: 'none' });
      }
    } catch (e) { wx.showToast({ title: '登录失败', icon: 'none' }); }
    this.setData({ loading: false });
  },
});
