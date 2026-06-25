// pages/mine/index.js
const app = getApp()

Page({
  data: { loggedIn: true, userId: 1 },

  login() {
    // TODO: 微信一键登录
    wx.login({
      success(res) {
        console.log('code:', res.code)
        // 发送 code 到后端换取 openid 和用户 ID
        app.globalData.userId = 1
        this.setData({ loggedIn: true, userId: 1 })
        wx.showToast({ title: '登录成功', icon: 'success' })
      },
    })
  },

  toOrders() {
    wx.switchTab({ url: '/pages/order/index' })
  },
})
