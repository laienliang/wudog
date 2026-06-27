import { request } from '../../utils/request';

Page({
  data: {
    restaurant: null,
    loading: true,
    selectedSlot: null,
    bookingDate: '',
    guestCount: 2,
    contactName: '',
    contactPhone: '',
    remark: '',
    submitting: false,
    reviews: [],
  },

  onLoad(options) {
    this.fetchDetail(options.id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/restaurant/detail/${id}`);
      this.setData({ restaurant: res.data, loading: false });
      this.fetchReviews(id);
    } catch { this.setData({ restaurant: null, loading: false }); }
  },

  async fetchReviews(id) {
    try {
      const res = await request('/api/restaurant-review/list', 'GET', { target_type: 'restaurant', target_id: id, pageSize: 10 });
      this.setData({ reviews: res.data.list || [] });
    } catch { /* */ }
  },

  onSlotTap(e) {
    const { id } = e.currentTarget.dataset;
    const slot = this.data.restaurant.slots.find(s => s.id === Number(id));
    this.setData({ selectedSlot: slot || null });
  },

  onDateChange(e) {
    this.setData({ bookingDate: e.detail.value });
  },

  onGuestInput(e) { this.setData({ guestCount: Number(e.detail.value) }); },
  onNameInput(e) { this.setData({ contactName: e.detail.value }); },
  onPhoneInput(e) { this.setData({ contactPhone: e.detail.value }); },
  onRemarkInput(e) { this.setData({ remark: e.detail.value }); },

  async handleBooking() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    const { restaurant, selectedSlot, bookingDate, guestCount, contactName, contactPhone, remark } = this.data;
    if (!selectedSlot) { wx.showToast({ title: '请选择时段', icon: 'none' }); return; }
    if (!bookingDate) { wx.showToast({ title: '请选择日期', icon: 'none' }); return; }
    if (!contactName || !contactPhone) { wx.showToast({ title: '请填写联系信息', icon: 'none' }); return; }

    this.setData({ submitting: true });
    try {
      await request('/api/restaurant-booking/create', 'POST', {
        restaurant_id: restaurant.id,
        booking_date: bookingDate,
        slot_id: selectedSlot.id,
        guest_count: guestCount,
        contact_name: contactName,
        contact_phone: contactPhone,
        remark: remark || undefined,
      });
      wx.showToast({ title: '预订成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch { wx.showToast({ title: '预订失败', icon: 'none' }); } finally {
      this.setData({ submitting: false });
    }
  },
});
