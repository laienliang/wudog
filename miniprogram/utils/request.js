// utils/request.js
const BASE = '' // 开发者工具中配置请求域名合法域名

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
