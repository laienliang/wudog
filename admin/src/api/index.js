import request from '../utils/request'

// 住宿
export const getAccommodationList = (params) => request.get('/accommodation/list', { params })
export const getAccommodationDetail = (id) => request.get(`/accommodation/detail/${id}`)
export const createAccommodation = (data) => request.post('/accommodation/create', data)
export const updateAccommodation = (id, data) => request.put(`/accommodation/update/${id}`, data)
export const deleteAccommodation = (id) => request.delete(`/accommodation/delete/${id}`)

// 苗寨
export const getVillageList = (params) => request.get('/miao-village/list', { params })
export const getVillageDetail = (id) => request.get(`/miao-village/detail/${id}`)
export const createVillage = (data) => request.post('/miao-village/create', data)
export const updateVillage = (id, data) => request.put(`/miao-village/update/${id}`, data)
export const deleteVillage = (id) => request.delete(`/miao-village/delete/${id}`)

// 房型
export const getRoomList = (params) => request.get('/room/list', { params })
export const getRoomDetail = (id) => request.get(`/room/detail/${id}`)
export const createRoom = (data) => request.post('/room/create', data)
export const updateRoom = (id, data) => request.put(`/room/update/${id}`, data)
export const deleteRoom = (id) => request.delete(`/room/delete/${id}`)

// 订单
export const getOrderList = (params) => request.get('/order/list', { params })
export const getOrderDetail = (id) => request.get(`/order/detail/${id}`)
export const createOrder = (data) => request.post('/order/create', data)
export const updateOrder = (id, data) => request.put(`/order/update/${id}`, data)
export const deleteOrder = (id) => request.delete(`/order/delete/${id}`)

// 评论
export const getReviewList = (params) => request.get('/review/list', { params })
export const deleteReview = (id) => request.delete(`/review/delete/${id}`)

// 房态日历
export const getCalendarList = (params) => request.get('/room-calendar/list', { params })
export const createCalendar = (data) => request.post('/room-calendar/create', data)
export const updateCalendar = (id, data) => request.put(`/room-calendar/update/${id}`, data)
export const deleteCalendar = (id) => request.delete(`/room-calendar/delete/${id}`)
export const batchCalendar = (items) => request.post('/room-calendar/batch', { items })

// 用户
export const getUserList = (params) => request.get('/user/list', { params })
