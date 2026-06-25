const { request } = require('../utils/request')

module.exports = {
  // ---- 景区 ----
  getScenicSpots(page = 1, pageSize = 10) {
    return request(`/api/scenic-spots?page=${page}&pageSize=${pageSize}`)
  },
  getScenicSpot(id) {
    return request(`/api/scenic-spots/${id}`)
  },

  // ---- 票种 ----
  getTicketTypes(scenicId) {
    return request(`/api/ticket-types?scenicId=${scenicId}`)
  },

  // ---- 路线 ----
  getRoutes(page = 1, pageSize = 10) {
    return request(`/api/routes?page=${page}&pageSize=${pageSize}`)
  },
  getRoute(id) {
    return request(`/api/routes/${id}`)
  },

  // ---- 订单 ----
  createOrder(data) {
    return request('/api/orders', 'POST', data)
  },
  getMyOrders(userId, page = 1, pageSize = 10) {
    return request(`/api/orders/my?userId=${userId}&page=${page}&pageSize=${pageSize}`)
  },
  cancelOrder(id) {
    return request(`/api/orders/${id}/cancel`, 'PUT')
  },
}
