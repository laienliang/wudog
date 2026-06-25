import request from '../utils/request'

export const getMiaoVillageList = (params) =>
  request.get('/miao-village/list', { params })

export const getMiaoVillageDetail = (id) =>
  request.get(`/miao-village/detail/${id}`)
