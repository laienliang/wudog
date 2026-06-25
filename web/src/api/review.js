import request from '../utils/request'

export const getReviewList = (params) =>
  request.get('/review/list', { params })

export const createReview = (data) =>
  request.post('/review/create', data)

export const deleteReview = (id) =>
  request.delete(`/review/delete/${id}`)
