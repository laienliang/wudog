/* ============================================================
   我的订单列表
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\list.js
   ============================================================ */
const { get, post } = require('../../utils/request');
const { ORDER_STATUS } = require('../../utils/constants');

Page({
  data: {
    list: [], activeTab: '', loading: false, statusMap: ORDER_STATUS,
  },

  onShow() {
    // 每次进入页面默认展示"全部"Tab，避免旧 Tab 筛选条件残留
    // （wx.switchTab 不销毁页面实例，data 保持上次的值）
    this.setData({ activeTab: '' });
    this.fetchData();
  },

  onTab(e) { this.setData({ activeTab: e.currentTarget.dataset.tab }); this.fetchData(); },

  async fetchData() {
    this.setData({ loading: true });
    try {
      const params = { pageSize: 50 };
      if (this.data.activeTab) params.status = this.data.activeTab;
      const res = await get('/api/lodging/orders', params);
      this.setData({ list: res.list || [], loading: false });
    } catch { this.setData({ loading: false }); }
  },

  onDetail(e) {
    wx.navigateTo({ url: `/pages/order/detail?id=${e.currentTarget.dataset.id}` });
  },

  onCancel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消',
      content: '取消订单将按退改规则返还（如有退款）',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await post('/api/lodging/order/cancel', { orderId: id, reason: '用户主动取消' });
          wx.showToast({ title: '已取消', icon: 'success' });
          this.fetchData();
        } catch { /* ignore */ }
      },
    });
  },
});
