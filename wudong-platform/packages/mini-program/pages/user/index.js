Page({
  data: { userName: '用户' },
  onShow() { this.loadUserInfo(); },
  async loadUserInfo() {
    try {
      var BASE = 'http://127.0.0.1:7001/api/v1';
      var res = await new Promise(r => wx.request({ url: BASE + '/travelogues?page=1&pageSize=1', success: r }));
      var list = (res.data && res.data.data && res.data.data.list) || [];
      var name = list[0] ? list[0].user_name : '用户';
      this.setData({ userName: name, userAvatar: name.charAt(0) });
    } catch (e) {}
  },
  goToProfile() { wx.navigateTo({ url: '/pages/user/profile' }); },
  goToMessages() { wx.navigateTo({ url: '/pages/user/messages' }); },
  goToOrders() { wx.navigateTo({ url: '/pages/user/orders' }); },
  goToFavorites() { wx.navigateTo({ url: '/pages/user/favorites' }); },
  goToReviews() { wx.showToast({ title: '开发中', icon: 'none' }); },
  goToMerchant() { wx.navigateTo({ url: '/pages/user/merchant-register' }); },
});
