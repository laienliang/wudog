import { request } from '../../utils/request';

Page({
  data: {
    spot: null,
    loading: true,
    selectedTicket: null,
    visitorName: '',
    visitorIdCard: '',
    visitDate: '',
    quantity: 1,
    submitting: false,
  },

  onLoad(options) {
    this.fetchDetail(options.id);
  },

  async fetchDetail(id) {
    this.setData({ loading: true });
    try {
      const res = await request(`/api/scenic-spot/detail/${id}`);
      this.setData({ spot: res.data, loading: false });
    } catch { this.setData({ spot: null, loading: false }); }
  },

  onTicketTap(e) {
    const { id } = e.currentTarget.dataset;
    const ticket = this.data.spot.ticketTypes.find(t => t.id === Number(id));
    this.setData({ selectedTicket: ticket || null });
  },

  onNameInput(e) { this.setData({ visitorName: e.detail.value }); },
  onIdCardInput(e) { this.setData({ visitorIdCard: e.detail.value }); },
  onDateChange(e) { this.setData({ visitDate: e.detail.value }); },
  onQtyChange(e) { this.setData({ quantity: Number(e.detail.value) }); },

  async handleBuy() {
    const token = wx.getStorageSync('token');
    if (!token) { wx.navigateTo({ url: '/pages/login/login' }); return; }
    const { selectedTicket, visitorName, visitorIdCard, visitDate, quantity } = this.data;
    if (!selectedTicket) { wx.showToast({ title: '请选择票种', icon: 'none' }); return; }
    if (!visitorName || !visitorIdCard) { wx.showToast({ title: '请填写游客信息', icon: 'none' }); return; }
    if (!visitDate) { wx.showToast({ title: '请选择游玩日期', icon: 'none' }); return; }

    this.setData({ submitting: true });
    try {
      await request('/api/e-ticket/create', 'POST', {
        ticket_type_id: selectedTicket.id,
        visit_date: visitDate,
        visitor_name: visitorName,
        visitor_id_card: visitorIdCard,
        quantity,
        price: selectedTicket.price,
      });
      wx.showToast({ title: '购票成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch { wx.showToast({ title: '购票失败', icon: 'none' }); } finally {
      this.setData({ submitting: false });
    }
  },
});
