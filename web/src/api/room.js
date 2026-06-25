import request from '../utils/request'

export const getRoomList = (params) =>
  request.get('/room/list', { params })

export const getRoomDetail = (id) =>
  request.get(`/room/detail/${id}`)

export const createRoom = (data) =>
  request.post('/room/create', data)

export const updateRoom = (id, data) =>
  request.put(`/room/update/${id}`, data)

export const deleteRoom = (id) =>
  request.delete(`/room/delete/${id}`)
