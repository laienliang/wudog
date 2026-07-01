const { getProductList, getCategoryList } = require('../../utils/api');

Page({
  data: {
    products: [],
    categories: [],
    categoryNames: ['全部分类'],
    categoryIndex: 0,
    keyword: '',
    page: 1,
    loading: false,
    hasMore: true,
  },

  onLoad() {
    this.loadCategories();
    this.loadProducts();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true });
    this.loadProducts().then(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadProducts(true);
    }
  },

  async loadCategories() {
    try {
      const res = await getCategoryList();
      const categories = res.data || [];
      this.setData({
        categories,
        categoryNames: ['全部分类', ...categories.map(c => c.name)],
      });
    } catch {}
  },

  async loadProducts(append = false) {
    this.setData({ loading: true });
    try {
      const params = { page: this.data.page, pageSize: 10 };
      if (this.data.keyword) params.keyword = this.data.keyword;
      if (this.data.categoryIndex > 0) {
        params.categoryId = this.data.categories[this.data.categoryIndex - 1].id;
      }
      const res = await getProductList(params);
      const list = res.data?.list || [];
      this.setData({
        products: append ? [...this.data.products, ...list] : list,
        hasMore: list.length >= 10,
      });
    } catch {}
    finally { this.setData({ loading: false }); }
  },

  onSearchInput(e) { this.setData({ keyword: e.detail.value }); },
  onSearch() { this.setData({ page: 1 }); this.loadProducts(); },
  onCategoryChange(e) { this.setData({ categoryIndex: e.detail.value, page: 1 }); this.loadProducts(); },
  goDetail(e) { wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }); },
});
