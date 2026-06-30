const BASE = 'http://127.0.0.1:7001/api/v1';
Page({
  data: {
    slots: [], selectedSlot: null, date: '', guests: 2, contactName: '', contactPhone: '',
    guestOptions: [1,2,3,4,5,6,7,8,9,10].map(n => n + '位'),
    submitting: false, id: null,
  },
  onLoad(options) {
    if (options.id) { this.setData({ id: options.id }); this.loadSlots(options.id); }
  },
  async loadSlots(id) {
    try {
      const res = await new Promise(r => wx.request({ url: BASE + '/restaurants/' + id + '/slots', success: r }));
      this.setData({ slots: res.data?.data || res.data || [] });
    } catch (e) { wx.showToast({ title: '加载失败', icon: 'none' }); }
  },
  onDateChange(e) { this.setData({ date: e.detail.value }); },
  onSlotChange(e) { this.setData({ selectedSlot: this.data.slots[e.detail.value] }); },
  onGuestChange(e) { this.setData({ guests: e.detail.value + 1 }); },
  onNameInput(e) { this.setData({ contactName: e.detail.value }); },
  onPhoneInput(e) { this.setData({ contactPhone: e.detail.value }); },
  async onSubmit() {
    const { id, date, selectedSlot, guests, contactName, contactPhone } = this.data;
    if (!date || !selectedSlot || !contactName || !contactPhone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' }); return;
    }
    this.setData({ submitting: true });
    try {
      const token = wx.getStorageSync('token');
      if (!token) { wx.showToast({ title: '请先登录', icon: 'none' }); this.setData({ submitting: false }); return; }
      await new Promise((resolve, reject) => wx.request({
        url: BASE + '/restaurants/booking', method: 'POST',
        header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        data: { slotId: selectedSlot.id, merchantId: 1, date, guests, contactName, contactPhone },
        success: resolve, fail: reject,
      }));
      wx.showToast({ title: '预订成功，已支付', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (e) { wx.showToast({ title: '预订失败', icon: 'none' }); }
    this.setData({ submitting: false });
  },
});
