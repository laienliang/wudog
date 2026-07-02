import { request } from '../../utils/request';

Page({
  data: {
    homestay: null,
    loading: true,
    selectedRoom: null,
    checkIn: '',
    checkOut: '',
    guestName: '',
    guestPhone: '',
    roomCount: 1,
    nights: 0,
    submitting: false,
    reviews: [],
  },

  onLoad(options) {
    this.fetchDetail(options.id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/homestay/detail/${id}`);
      const data = res.data;
      if (data && data.styleTags) {
        data.styleTagList = data.styleTags.split(',');
      }
      this.setData({ homestay: data, loading: false });
      this.fetchReviews(id);
    } catch { this.setData({ homestay: null, loading: false }); }
  },

  async fetchReviews(id) {
    try {
      const res = await request('/api/homestay-review/list', 'GET', { homestay_id: id, pageSize: 10 });
      this.setData({ reviews: res.data.list || [] });
    } catch { /* */ }
  },

  onRoomTap(e) {
    const { id } = e.currentTarget.dataset;
    const room = this.data.homestay.roomTypes.find(r => r.id === Number(id));
    this.setData({ selectedRoom: room || null });
  },

  onCheckInChange(e) { this.setData({ checkIn: e.detail.value }); this.updateNights(); },
  onCheckOutChange(e) { this.setData({ checkOut: e.detail.value }); this.updateNights(); },
  onNameInput(e) { this.setData({ guestName: e.detail.value }); },
  onPhoneInput(e) { this.setData({ guestPhone: e.detail.value }); },
  onRoomCountChange(e) { this.setData({ roomCount: Number(e.detail.value) }); },

  updateNights() {
    const { checkIn, checkOut } = this.data;
    if (!checkIn || !checkOut) { this.setData({ nights: 0 }); return; }
    const d1 = new Date(checkIn.replace(/-/g, '/'));
    const d2 = new Date(checkOut.replace(/-/g, '/'));
    this.setData({ nights: Math.max(0, Math.round((d2 - d1) / 86400000)) });
  },

  async handleBooking() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    const { homestay, selectedRoom, checkIn, checkOut, guestName, guestPhone, roomCount } = this.data;
    if (!selectedRoom) { wx.showToast({ title: '请选择房型', icon: 'none' }); return; }
    if (!checkIn || !checkOut) { wx.showToast({ title: '请选择日期', icon: 'none' }); return; }
    if (!guestName || !guestPhone) { wx.showToast({ title: '请填写入住人信息', icon: 'none' }); return; }

    const nights = this.data.nights;
    if (nights <= 0) { wx.showToast({ title: '离店日期须晚于入住', icon: 'none' }); return; }

    this.setData({ submitting: true });
    try {
      await request('/api/homestay-booking/create', 'POST', {
        homestay_id: homestay.id,
        room_type_id: selectedRoom.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        nights,
        room_count: roomCount,
        guest_name: guestName,
        guest_phone: guestPhone,
        total_amount: selectedRoom.basePrice * nights * roomCount,
      });
      wx.showToast({ title: '预订成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch { wx.showToast({ title: '预订失败', icon: 'none' }); } finally {
      this.setData({ submitting: false });
    }
  },
});
