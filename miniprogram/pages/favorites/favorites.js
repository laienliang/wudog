const { getFavoriteList, toggleFavorite } = require('../../utils/api');

Page({
  data: {
    favorites: [],
    loading: false,
  },

  onShow() { this.loadFavorites(); },

  async loadFavorites() {
    this.setData({ loading: true });
    try {
      const res = await getFavoriteList();
      const list = (res.data || []).map(item => ({
        ...item,
        imageUrl: item.product?.images?.[0]?.image_url || '/images/placeholder.png',
        productName: item.product?.name || '商品',
        minPrice: item.product?.min_price || '暂无',
      }));
      this.setData({ favorites: list });
    } catch {}
    finally { this.setData({ loading: false }); }
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` });
  },

  async onUnfavorite(e) {
    const productId = e.currentTarget.dataset.id;
    try {
      await toggleFavorite({ product_id: productId });
      wx.showToast({ title: '已取消收藏', icon: 'success' });
      this.loadFavorites();
    } catch {}
  },
});
