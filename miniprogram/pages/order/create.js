/* ============================================================
   预订下单页
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\create.js
   ============================================================ */
const { post } = require('../../utils/request');
const { diffDays, today, daysFromNow } = require('../../utils/util');

Page({
  data: {
    roomId: null, homestayId: null, roomName: '', price: 0,
    checkIn: '', checkOut: '', nights: 0, totalPrice: 0,
    contactName: '', contactPhone: '', roomCount: 1, guestCount: 1,
    submitting: false, canSubmit: false,
    orderResult: null,
    today: today(), maxDate: daysFromNow(90), maxPlusOne: daysFromNow(91),
  },

  onLoad(options) {
    const { roomId, homestayId, roomName, price, checkIn, checkOut } = options;
    this.setData({
      roomId: Number(roomId) || 0,
      homestayId: Number(homestayId) || 0,
      roomName: decodeURIComponent(roomName || ''),
      price: Number(price || 0),
      checkIn: checkIn || '',
      checkOut: checkOut || '',
    });
    // 若有预填日期，自动计算天数
    if (checkIn && checkOut) {
      const n = diffDays(checkIn, checkOut);
      this.setData({ nights: n > 0 ? n : 0 });
      this.calcTotal();
    }
  },

  calcTotal() {
    const { price, roomCount, nights } = this.data;
    const total = price * (parseInt(roomCount) || 1) * nights;
    const canSubmit = nights > 0 && !!this.data.contactName && !!this.data.contactPhone;
    this.setData({ totalPrice: total, canSubmit });
  },

  onCheckIn(e) {
    const cin = e.detail.value;
    this.setData({ checkIn: cin });
    if (this.data.checkOut) {
      const n = diffDays(cin, this.data.checkOut);
      this.setData({ nights: n > 0 ? n : 0 });
    }
    this.calcTotal();
  },
  onCheckOut(e) {
    const cout = e.detail.value;
    this.setData({ checkOut: cout });
    if (this.data.checkIn) {
      const n = diffDays(this.data.checkIn, cout);
      this.setData({ nights: n > 0 ? n : 0 });
    }
    this.calcTotal();
  },
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    let value = e.detail.value;
    if (field === 'roomCount' || field === 'guestCount') {
      value = parseInt(value) || 1;
    }
    this.setData({ [field]: value });
    this.calcTotal();
  },

  async onSubmit() {
    // 表单兜底校验
    if (!this.data.homestayId || !this.data.roomId) {
      wx.showToast({ title: '页面参数异常，请返回重新进入', icon: 'none' });
      return;
    }
    if (!this.data.checkIn || !this.data.checkOut) {
      wx.showToast({ title: '请选择入住和离店日期', icon: 'none' });
      return;
    }
    if (!this.data.contactName.trim()) {
      wx.showToast({ title: '请填写入住人姓名', icon: 'none' });
      return;
    }
    if (!this.data.contactPhone.trim()) {
      wx.showToast({ title: '请填写联系电话', icon: 'none' });
      return;
    }
    if (!this.data.canSubmit || this.data.submitting) return;

    this.setData({ submitting: true });
    try {
      const res = await post('/api/lodging/orders', {
        homestay_id: this.data.homestayId,
        room_id: this.data.roomId,
        check_in_date: this.data.checkIn,
        check_out_date: this.data.checkOut,
        room_count: parseInt(this.data.roomCount) || 1,
        contact_name: this.data.contactName.trim(),
        contact_phone: this.data.contactPhone.trim(),
        guest_count: parseInt(this.data.guestCount) || 1,
      });
      this.setData({ orderResult: res, submitting: false });
      wx.showToast({ title: '下单成功', icon: 'success', duration: 2000 });
    } catch (err) {
      this.setData({ submitting: false });
      // err.message 即后端返回的真实错误信息
      wx.showToast({ title: err.message || '下单失败，请重试', icon: 'none', duration: 3000 });
    }
  },

  onViewOrder() {
    wx.switchTab({ url: '/pages/order/list' });
  },
});
