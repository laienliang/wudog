/* ============================================================
   小程序入口 — 乌东苗寨民宿预订
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\app.js
   ============================================================ */
App({
  globalData: {
    baseURL: 'http://localhost:3000/api/lodging',
    userId: null,  // 临时用户标识，后续可接入 wx.login
    primaryColor: '#1F5FA8',
    accentColor: '#E85D2F',
  },

  onLaunch() {
    // 生成临时用户ID
    let uid = wx.getStorageSync('user_id');
    if (!uid) {
      uid = 'MP' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
      wx.setStorageSync('user_id', uid);
    }
    this.globalData.userId = uid;
    console.log('[乌东文旅] 小程序启动, userId:', uid);
  },
});
