import api from './api';

export const travelApi = {
  // 景区
  listScenicSpots(params?: any) { return api.get('/scenic-spots', { params }).then(r => r.data); },
  allScenicSpots() { return api.get('/scenic-spots/all').then(r => r.data); },
  getScenicSpot(id: number) { return api.get(`/scenic-spots/${id}`).then(r => r.data); },
  createScenicSpot(data: any) { return api.post('/scenic-spots', data).then(r => r.data); },
  updateScenicSpot(id: number, data: any) { return api.put(`/scenic-spots/${id}`, data).then(r => r.data); },
  deleteScenicSpot(id: number) { return api.delete(`/scenic-spots/${id}`).then(r => r.data); },

  // 票种
  listTicketTypes(scenicId?: number) {
    if (scenicId) return api.get(`/scenic-spots/${scenicId}/ticket-types`).then(r => r.data);
    return api.get('/ticket-types/all').then(r => r.data);
  },
  createTicketType(data: any) { return api.post('/ticket-types', data).then(r => r.data); },
  updateTicketType(id: number, data: any) { return api.put(`/ticket-types/${id}`, data).then(r => r.data); },
  deleteTicketType(id: number) { return api.delete(`/ticket-types/${id}`).then(r => r.data); },

  // 路线
  listRoutes(params?: any) { return api.get('/routes', { params }).then(r => r.data); },
  getRoute(id: number) { return api.get(`/routes/${id}`).then(r => r.data); },
  createRoute(data: any) { return api.post('/routes', data).then(r => r.data); },
  updateRoute(id: number, data: any) { return api.put(`/routes/${id}`, data).then(r => r.data); },
  deleteRoute(id: number) { return api.delete(`/routes/${id}`).then(r => r.data); },

  // 电子票
  listETickets(params?: any) { return api.get('/e-tickets', { params }).then(r => r.data); },
  verifyETicket(ticketCode: string) { return api.post('/e-tickets/verify', { ticketCode }).then(r => r.data); },
};
