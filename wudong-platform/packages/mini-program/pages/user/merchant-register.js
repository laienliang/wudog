const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: { submitting: false, done: false, modules: [] },
  onLoad() {
    this.setData({ modules: [
      { value: 'clothing', label: '🧣 民族服饰' },
      { value: 'food', label: '🍜 餐饮美食' },
      { value: 'accommodation', label: '🏡 民宿住宿' },
      { value: 'travel', label: '🗺️ 旅游线路' },
    ]});
  },
  onShopNameInput(e) { this.setData({ shopName: e.detail.value }); },
  onModuleChange(e) {
    const idx = e.detail.value;
    const m = this.data.modules[idx];
    this.setData({ module: m.value, moduleLabel: m.label });
  },
  onContactInput(e) { this.setData({ contactPerson: e.detail.value }); },
  onPhoneInput(e) { this.setData({ contactPhone: e.detail.value }); },
  async onSubmit() {
    const { shopName, module, contactPerson, contactPhone } = this.data;
    if (!shopName || !module) { wx.showToast({ title: '请填写完整信息', icon: 'none' }); return; }
    this.setData({ submitting: true });
    try {
      const token = wx.getStorageSync('token');
      if (!token) { wx.showToast({ title: '请先登录', icon: 'none' }); this.setData({ submitting: false }); return; }
      const res = await new Promise((resolve, reject) => wx.request({
        url: BASE + '/admin/merchant-applications', method: 'POST',
        header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        data: { userId: 1, shopName, module, contactPerson: contactPerson || '', contactPhone: contactPhone || '' },
        success: resolve, fail: reject,
      }));
      if (res.statusCode !== 200) throw new Error('请求失败');
      this.setData({ done: true });
    } catch (e) {
      console.error('Merchant register error:', e);
      wx.showToast({ title: '网络错误，请重试', icon: 'none' });
    }
    this.setData({ submitting: false });
  },
  goBack() { wx.navigateBack(); },
});
