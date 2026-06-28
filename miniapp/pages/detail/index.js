const { request } = require('../../utils/request');

Page({
  data: {
    detail: null,
    message: '',
  },

  onLoad(options) {
    this.productId = Number(options.id);
    this.loadDetail();
  },

  onShow() {
    this.loadDetail();
  },

  async loadDetail() {
    try {
      const detail = await request({
        url: `/app/wudong/products/detail?id=${this.productId}`,
        withToken: true,
      });
      this.setData({ detail, message: '' });
    } catch (error) {
      this.setData({ detail: null, message: error.message || '详情加载失败' });
    }
  },

  async onToggleFavorite() {
    const token = wx.getStorageSync('wudong-app-token');
    if (!token) {
      wx.showToast({
        title: '请先到收藏页登录',
        icon: 'none',
      });
      return;
    }

    if (!this.data.detail) {
      return;
    }

    const path = this.data.detail.isFavorite
      ? '/app/wudong/favorites/delete'
      : '/app/wudong/favorites/add';

    try {
      await request({
        url: path,
        method: 'POST',
        data: { productId: this.productId },
        withToken: true,
      });
      wx.showToast({
        title: this.data.detail.isFavorite ? '已取消收藏' : '收藏成功',
        icon: 'none',
      });
      this.loadDetail();
    } catch (error) {
      wx.showToast({
        title: error.message || '操作失败',
        icon: 'none',
      });
    }
  },

  goFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/index',
    });
  },
});
