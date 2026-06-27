const { get, post } = require('../../utils/request');
const { ORDER_STATUS } = require('../../utils/constants');

Page({
  data: { order: null, statusMap: ORDER_STATUS },
  onLoad(options) {
    get(`/api/lodging/orders/${options.id}`).then(order => this.setData({ order })).catch(() => {});
  },
  onCancel() {
    wx.showModal({
      title: '确认取消',
      content: '取消订单将按退改规则处理',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await post('/api/lodging/order/cancel', { orderId: this.data.order.id, reason: '用户取消' });
          wx.showToast({ title: '已取消', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1500);
        } catch {}
      },
    });
  },
});
