// app.js
App({
  onLaunch() {
    console.log('乌东文旅小程序启动');
  },
  globalData: {
    baseUrl: 'http://localhost:8001/api/open',
    userInfo: null,
  },
});
