import request from '../utils/request'

export const getRoomCalendarList = (params) => request.get('/room-calendar/list', { params })
export const queryRoomCalendar = (params) => request.get('/room-calendar/query', { params })
export const createRoomCalendar = (data) => request.post('/room-calendar/create', data)
export const batchRoomCalendar = (items) => request.post('/room-calendar/batch', { items })
export const updateRoomCalendar = (id, data) => request.put(`/room-calendar/update/${id}`, data)
export const deleteRoomCalendar = (id) => request.delete(`/room-calendar/delete/${id}`)
