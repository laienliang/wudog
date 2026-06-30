const { productApi } = require('../../utils/api');

Page({
  data: {
    products: [], categories: [], keyword: '', activeCategoryId: null,
    sortField: 'createdAt', sortOrder: 'DESC', page: 1, loading: false, hasMore: true,
    showHistory: false,
    searchHistory: [],
  },

  onLoad() {
    this.setData({ searchHistory: wx.getStorageSync('search_history') || [] });
    this.loadCategories();
    this.loadProducts();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, products: [], hasMore: true });
    this.loadProducts().then(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) this.loadProducts();
  },

  async loadCategories() {
    try { const data = await productApi.categories(); this.setData({ categories: data || [] }); } catch (e) { console.error(e); }
  },

  async loadProducts() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const params = { page: this.data.page, pageSize: 10, sortField: this.data.sortField, sortOrder: this.data.sortOrder };
      if (this.data.activeCategoryId) params.categoryId = this.data.activeCategoryId;
      if (this.data.keyword) params.keyword = this.data.keyword;
      const res = await productApi.list(params);
      const list = res.list || [];
      this.setData({
        products: this.data.page === 1 ? list : this.data.products.concat(list),
        page: this.data.page + 1, hasMore: list.length >= 10,
      });
    } catch (e) { console.error(e); }
    this.setData({ loading: false });
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategoryId: id || null, page: 1, products: [], hasMore: true, showHistory: false });
    this.loadProducts();
  },

  onSortTap(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ sortField: field, page: 1, products: [], hasMore: true, showHistory: false });
    this.loadProducts();
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value, showHistory: e.detail.value === '' });
  },

  onSearch() {
    const kw = this.data.keyword.trim();
    if (!kw) return;
    let history = wx.getStorageSync('search_history') || [];
    history = [kw, ...history.filter(h => h !== kw)].slice(0, 5);
    wx.setStorageSync('search_history', history);
    this.setData({ page: 1, products: [], hasMore: true, showHistory: false, searchHistory: history });
    this.loadProducts();
  },

  onHistoryTap(e) {
    const kw = e.currentTarget.dataset.keyword;
    this.setData({ keyword: kw, showHistory: false, page: 1, products: [], hasMore: true });
    this.loadProducts();
  },

  clearHistory() {
    wx.removeStorageSync('search_history');
    this.setData({ searchHistory: [] });
  },

  onProductTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/clothing/detail?id=' + id });
  },
});
