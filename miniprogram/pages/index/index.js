/* ============================================================
   首页 — 民宿列表
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\index\index.js
   ============================================================ */
const { get } = require('../../utils/request');
const { today, daysFromNow } = require('../../utils/util');

Page({
  data: {
    list: [],
    leftList: [],
    rightList: [],
    total: 0,
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    loadingMore: false,
    keyword: '',
    checkIn: '',
    checkOut: '',
    sort: 'rating_desc',
    today: today(),
    tomorrow: daysFromNow(1),
    maxDate: daysFromNow(90),
    maxPlusOne: daysFromNow(91),
  },

  onLoad() { this.fetchData(); },

  onPullDownRefresh() {
    this.setData({ page: 1, list: [], leftList: [], rightList: [], hasMore: true });
    this.fetchData().then(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true, page: this.data.page + 1 });
    this.fetchData(true);
  },

  /** 瀑布流分两列 */
  splitColumns(all) {
    const left = [], right = [];
    let leftH = 0, rightH = 0;
    all.forEach(item => {
      // 用 min_price 估算高度（高价格 = 高卡片）
      const h = (item.min_price || 200) / 10;
      if (leftH <= rightH) { left.push(item); leftH += h; }
      else { right.push(item); rightH += h; }
    });
    return { left, right };
  },

  async fetchData(append = false) {
    const { checkIn, checkOut, sort, keyword, page, pageSize } = this.data;
    this.setData({ loading: !append, loadingMore: append });

    try {
      let res;
      if (checkIn && checkOut) {
        res = await get('/api/homestay/search', {
          checkInDate: checkIn, checkOutDate: checkOut,
          keyword, sort, page, pageSize,
        });
      } else {
        res = await get('/api/homestay/list', { page, pageSize, keyword, sort });
      }

      const newList = append ? [...this.data.list, ...(res.list || [])] : (res.list || []);
      const cols = this.splitColumns(newList);

      this.setData({
        list: newList,
        leftList: cols.left,
        rightList: cols.right,
        total: res.total || 0,
        hasMore: newList.length < (res.total || 0),
        loading: false,
        loadingMore: false,
      });
    } catch {
      this.setData({ loading: false, loadingMore: false });
    }
  },

  onCheckInChange(e) {
    const val = e.detail.value;
    getApp().globalData.checkIn = val;
    this.setData({ checkIn: val, page: 1, list: [], hasMore: true });
    this.fetchData();
  },
  onCheckOutChange(e) {
    const val = e.detail.value;
    getApp().globalData.checkOut = val;
    this.setData({ checkOut: val, page: 1, list: [], hasMore: true });
    this.fetchData();
  },
  onSort(e) {
    this.setData({ sort: e.currentTarget.dataset.sort, page: 1, list: [], hasMore: true });
    this.fetchData();
  },
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },
  onSearch() {
    this.setData({ page: 1, list: [], leftList: [], rightList: [], hasMore: true });
    this.fetchData();
  },
  onRefresh() { this.fetchData(); },
});
