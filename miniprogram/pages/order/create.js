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
    const { roomId, homestayId, roomName, price } = options;
    this.setData({
      roomId: Number(roomId), homestayId: Number(homestayId),
      roomName: decodeURIComponent(roomName || ''), price: Number(price || 0),
    });
  },

  calcTotal() {
    const { price, roomCount, nights } = this.data;
    const total = price * roomCount * nights;
    const canSubmit = nights > 0 && this.data.contactName && this.data.contactPhone;
    this.setData({ totalPrice: total, canSubmit });
  },

  onCheckIn(e) {
    this.setData({ checkIn: e.detail.value });
    if (this.data.checkOut) {
      const n = diffDays(this.data.checkIn, this.data.checkOut);
      this.setData({ nights: n > 0 ? n : 0 });
      this.calcTotal();
    }
  },
  onCheckOut(e) {
    this.setData({ checkOut: e.detail.value });
    if (this.data.checkIn) {
      const n = diffDays(this.data.checkIn, this.data.checkOut);
      this.setData({ nights: n > 0 ? n : 0 });
      this.calcTotal();
    }
  },
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
    this.calcTotal();
  },

  async onSubmit() {
    if (!this.data.canSubmit) return;
    this.setData({ submitting: true });
    try {
      const res = await post('/api/lodging/orders', {
        homestay_id: this.data.homestayId,
        room_id: this.data.roomId,
        check_in_date: this.data.checkIn,
        check_out_date: this.data.checkOut,
        room_count: this.data.roomCount,
        contact_name: this.data.contactName,
        contact_phone: this.data.contactPhone,
        guest_count: this.data.guestCount,
      });
      this.setData({ orderResult: res, submitting: false });
    } catch {
      this.setData({ submitting: false });
    }
  },

  onViewOrder() {
    wx.switchTab({ url: '/pages/order/list' });
  },
});
