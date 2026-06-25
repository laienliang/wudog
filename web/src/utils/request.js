import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 响应拦截 - 统一处理业务错误
request.interceptors.response.use(
  (res) => {
    const { code, message, data } = res.data
    if (code === 200) return data
    return Promise.reject(new Error(message || '请求失败'))
  },
  (err) => {
    const msg = err.response?.data?.message || err.message || '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export default request
