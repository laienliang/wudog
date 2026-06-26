// utils/request.js
// 开发环境：使用本地后端地址
// 生产环境：需要配置为实际域名（且需在微信公众平台配置服务器域名白名单）
const BASE = 'http://36.137.196.248:8001'

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + (wx.getStorageSync('token') || ''),
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code >= 200 && res.data.code < 400) {
            resolve(res.data.data)
          } else {
            wx.showToast({ title: res.data.message || '请求失败', icon: 'none' })
            reject(new Error(res.data.message))
          }
        } else {
          wx.showToast({ title: '网络错误', icon: 'none' })
          reject(new Error('network error'))
        }
      },
      fail(err) {
        wx.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      },
    })
  })
}

module.exports = { request }
