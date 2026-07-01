const app = getApp();

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    userInitial: '?',
  },

  onShow() {
    const token = app.globalData.token;
    const userInfo = app.globalData.userInfo;
    const userInitial = userInfo?.nickname?.[0] || userInfo?.username?.[0] || '?';
    this.setData({
      isLoggedIn: !!token,
      userInfo: userInfo || null,
      userInitial,
    });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  goPage(e) {
    if (!app.checkLogin()) return;
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.token = '';
          app.globalData.userInfo = null;
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          this.setData({ isLoggedIn: false, userInfo: null, userInitial: '?' });
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      },
    });
  },
});
