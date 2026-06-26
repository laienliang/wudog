const { request } = require('../utils/request')

module.exports = {
  // ---- 景区 ----
  getScenicSpots(page = 1, pageSize = 10) {
    return request(`/open/client/page?type=scenic&page=${page}&pageSize=${pageSize}`)
  },
  getScenicSpot(id) {
    return request(`/open/client/detail?type=scenic&id=${id}`)
  },

  // ---- 票种 ----
  getTicketTypes(scenicId) {
    return request(`/open/client/page?type=ticket&scenicId=${scenicId}`)
  },

  // ---- 路线 ----
  getRoutes(page = 1, pageSize = 10) {
    return request(`/open/client/page?type=route&page=${page}&pageSize=${pageSize}`)
  },
  getRoute(id) {
    return request(`/open/client/detail?type=route&id=${id}`)
  },

  // ---- 订单 ----
  createOrder(data) {
    return request('/open/client/order/create', 'POST', data)
  },
  getMyOrders(userId, page = 1, pageSize = 10) {
    return request(`/open/client/order/page?userId=${userId}&page=${page}&pageSize=${pageSize}`)
  },
  cancelOrder(id) {
    return request('/open/client/order/status', 'POST', { id, status: 3 })
  },
}
