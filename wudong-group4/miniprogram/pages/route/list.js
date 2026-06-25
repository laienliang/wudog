// pages/route/list.js
const api = require('../../utils/api')

Page({
  data: { routes: [] },

  onLoad() {
    api.getRoutes(1, 20).then((res) => {
      this.setData({ routes: res.list })
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/route/detail?id=${id}` })
  },
})
