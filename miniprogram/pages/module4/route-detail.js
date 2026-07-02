import { request } from '../../utils/request';

Page({
  data: {
    route: null,
    loading: true,
    quantity: 1,
    contactName: '',
    contactPhone: '',
    submitting: false,
    totalPrice: '0.00',
  },

  onLoad(options) {
    this.fetchDetail(options.id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/tour-route/detail/${id}`);
      this.setData({ route: res.data, loading: false });
      this.calcTotal();
    } catch { this.setData({ route: null, loading: false }); }
  },

  calcTotal() {
    const { route, quantity } = this.data;
    if (route) {
      this.setData({ totalPrice: (Number(route.price) * quantity).toFixed(2) });
    }
  },

  onQtyMinus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
      this.calcTotal();
    }
  },

  onQtyPlus() {
    this.setData({ quantity: this.data.quantity + 1 });
    this.calcTotal();
  },

  onNameInput(e) { this.setData({ contactName: e.detail.value }); },
  onPhoneInput(e) { this.setData({ contactPhone: e.detail.value }); },

  async handleBooking() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    const { route, quantity, contactName, contactPhone } = this.data;
    if (!contactName || !contactPhone) { wx.showToast({ title: '请填写联系信息', icon: 'none' }); return; }

    this.setData({ submitting: true });
    try {
      await request('/public/order/create', 'POST', {
        type: 'tour',
        items: [{
          item_type: 'tour_route',
          item_id: route.id,
          item_name: route.title,
          item_image: route.mainImage || '',
          price: Number(route.price),
          quantity,
        }],
        remark: `联系人: ${contactName} ${contactPhone}`,
      });
      wx.showToast({ title: '下单成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch { wx.showToast({ title: '下单失败', icon: 'none' }); } finally {
      this.setData({ submitting: false });
    }
  },
});
