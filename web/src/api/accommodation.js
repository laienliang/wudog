import request from '../utils/request'

export const getAccommodationList = (params) => request.get('/accommodation/list', { params })
export const getAccommodationDetail = (id) => request.get(`/accommodation/detail/${id}`)
export const createAccommodation = (data) => request.post('/accommodation/create', data)
export const updateAccommodation = (id, data) => request.put(`/accommodation/update/${id}`, data)
export const deleteAccommodation = (id) => request.delete(`/accommodation/delete/${id}`)
