/* ============================================================
   我的收藏
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\favorites.js
   ============================================================ */
const { get } = require('../../utils/request');

Page({
  data: { list: [], loading: false },
  onShow() { this.fetchData(); },
  async fetchData() {
    this.setData({ loading: true });
    try {
      const res = await get('/api/favorites/list', { pageSize: 100 });
      this.setData({ list: res.list || [], loading: false });
    } catch { this.setData({ loading: false }); }
  },
});
