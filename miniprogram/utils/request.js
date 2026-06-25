// utils/request.js - 统一请求封装
// 注意：不在这里调用 getApp()，避免模块加载时序问题

const BASE_URL = 'http://localhost:3000'
const IMG_BASE = 'http://localhost:3000'

/**
 * 处理图片路径：将相对路径转为完整URL
 * @param {object|array} item - 数据对象或数组
 * @param {string} field - 字段名，默认 'coverImage'
 */
function fixImageUrl(item, field = 'coverImage') {
  if (!item) return
  if (Array.isArray(item)) {
    item.forEach(i => fixImageUrl(i, field))
    return
  }
  if (typeof item === 'string' && item.startsWith('/')) {
    // 如果是字符串就直接加上前缀——但这是数组中的直接操作
    // 对于纯字符串数组，需要调用方自行处理，这里不做修改
    return
  }
  if (typeof item === 'object') {
    if (item[field] && typeof item[field] === 'string' && item[field].startsWith('/')) {
      item[field] = IMG_BASE + item[field]
    }
    // 递归处理嵌套数组（如 rooms、images）
    Object.keys(item).forEach(key => {
      if (Array.isArray(item[key])) {
        fixImageUrl(item[key], field)
      }
    })
  }
}

/**
 * 统一请求方法
 * @param {string} url - 请求路径
 * @param {string} method - 请求方法 GET/POST/PUT/DELETE
 * @param {object} data - 请求数据
 * @returns {Promise} - 返回 Promise
 */
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        // 根据后端统一响应格式处理
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 */
function get(url, data = {}) {
  return request(url, 'GET', data)
}

/**
 * POST 请求
 */
function post(url, data = {}) {
  return request(url, 'POST', data)
}

/**
 * PUT 请求
 */
function put(url, data = {}) {
  return request(url, 'PUT', data)
}

/**
 * DELETE 请求
 */
function del(url, data = {}) {
  return request(url, 'DELETE', data)
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  fixImageUrl,
  IMG_BASE
}
