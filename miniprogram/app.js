// app.js
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('乌东文旅小程序启动')
  },

  globalData: {
    // 后端接口基础 URL
    // 本地开发时使用 localhost:3000
    // 真机调试时需要改为本机 IP，如 http://192.168.x.x:3000
    baseUrl: 'http://localhost:3000'
  }
})
