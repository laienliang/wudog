// app.js
App({
  globalData: {
    userId: 1, // TODO: 登录后替换为 openid 映射的用户 ID
    baseUrl: 'http://localhost:3000/api',
  },

  onLaunch() {
    // 尝试微信静默登录
    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          // TODO: 调用后端 /api/wechat/login 用 code 换取 openid
          console.log('wx.login code:', res.code)
        }
      },
    })
  },
})
