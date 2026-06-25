import request from '../utils/request'

export const getOrderList = (params) =>
  request.get('/order/list', { params })

export const getOrderDetail = (id) =>
  request.get(`/order/detail/${id}`)

export const createOrder = (data) =>
  request.post('/order/create', data)

export const updateOrder = (id, data) =>
  request.put(`/order/update/${id}`, data)

export const deleteOrder = (id) =>
  request.delete(`/order/delete/${id}`)
