import api from './api';

export const accommodationApi = {
  listHomestays(params?: any) { return api.get('/homestays', { params }).then(r => r.data); },
  allHomestays() { return api.get('/homestays/all').then(r => r.data); },
  getHomestay(id: number) { return api.get(`/homestays/${id}`).then(r => r.data); },
  createHomestay(data: any) { return api.post('/homestays', data).then(r => r.data); },
  updateHomestay(id: number, data: any) { return api.put(`/homestays/${id}`, data).then(r => r.data); },
  deleteHomestay(id: number) { return api.delete(`/homestays/${id}`).then(r => r.data); },

  listRoomTypes(homestayId?: number) {
    if (homestayId) return api.get(`/homestays/${homestayId}/room-types`).then(r => r.data);
    return api.get('/room-types/all').then(r => r.data);
  },
  createRoomType(data: any) { return api.post('/room-types', data).then(r => r.data); },
  updateRoomType(id: number, data: any) { return api.put(`/room-types/${id}`, data).then(r => r.data); },
  deleteRoomType(id: number) { return api.delete(`/room-types/${id}`).then(r => r.data); },

  getCalendar(roomTypeId: number, month: string) { return api.get(`/room-types/${roomTypeId}/calendar`, { params: { month } }).then(r => r.data); },
  batchSetCalendar(data: any) { return api.post('/calendar/batch', data).then(r => r.data); },

  listOrders(params?: any) { return api.get('/accommodation-orders', { params }).then(r => r.data); },
  listAccommodationReviews(params?: any) { return api.get('/accommodation-reviews', { params }).then(r => r.data); },
};
