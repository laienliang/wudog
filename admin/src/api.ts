const BASE = '' // Vite proxy handles /api → localhost:3000

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(BASE + url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  const json: ApiResponse<T> = await res.json()
  if (json.code >= 400) {
    if (json.code === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    throw new Error(json.message || '请求失败')
  }
  return json.data as T
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
}

export const api = {
  // ---- Auth ----
  login: (username: string, password: string) =>
    request<{ token: string; user: { id: number; username: string; nickname: string } }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // ---- 景区 ----
  getScenicSpots: (page = 1, pageSize = 10) =>
    request<{ list: any[]; total: number; page: number; pageSize: number }>(
      `/api/admin/scenic-spots?page=${page}&pageSize=${pageSize}`,
    ),
  createScenicSpot: (data: any) =>
    request<any>('/api/admin/scenic-spots', { method: 'POST', body: JSON.stringify(data) }),
  updateScenicSpot: (id: number, data: any) =>
    request<any>(`/api/admin/scenic-spots/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteScenicSpot: (id: number) =>
    request<any>(`/api/admin/scenic-spots/${id}`, { method: 'DELETE' }),
  toggleScenicSpotStatus: (id: number) =>
    request<any>(`/api/admin/scenic-spots/${id}/status`, { method: 'PUT' }),

  // ---- 票种 ----
  getTicketTypes: () =>
    request<any[]>('/api/admin/ticket-types'),
  createTicketType: (data: any) =>
    request<any>('/api/admin/ticket-types', { method: 'POST', body: JSON.stringify(data) }),
  updateTicketType: (id: number, data: any) =>
    request<any>(`/api/admin/ticket-types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTicketType: (id: number) =>
    request<any>(`/api/admin/ticket-types/${id}`, { method: 'DELETE' }),
  setDailyStocks: (id: number, stocks: { date: string; stock: number }[]) =>
    request<any>(`/api/admin/ticket-types/${id}/daily-stock`, {
      method: 'PUT',
      body: JSON.stringify({ stocks }),
    }),

  // ---- 路线 ----
  getRoutes: () => request<any[]>('/api/admin/routes'),
  createRoute: (data: any) =>
    request<any>('/api/admin/routes', { method: 'POST', body: JSON.stringify(data) }),
  updateRoute: (id: number, data: any) =>
    request<any>(`/api/admin/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoute: (id: number) =>
    request<any>(`/api/admin/routes/${id}`, { method: 'DELETE' }),
  toggleRouteStatus: (id: number) =>
    request<any>(`/api/admin/routes/${id}/status`, { method: 'PUT' }),
  setRouteDailyStocks: (id: number, stocks: { date: string; stock: number }[]) =>
    request<any>(`/api/admin/routes/${id}/daily-stock`, {
      method: 'PUT',
      body: JSON.stringify({ stocks }),
    }),

  // ---- 行程 ----
  addItinerary: (routeId: number, data: any) =>
    request<any>(`/api/admin/routes/${routeId}/itineraries`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateItinerary: (routeId: number, itId: number, data: any) =>
    request<any>(`/api/admin/routes/${routeId}/itineraries/${itId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteItinerary: (routeId: number, itId: number) =>
    request<any>(`/api/admin/routes/${routeId}/itineraries/${itId}`, { method: 'DELETE' }),

  // ---- 订单 ----
  getOrders: (page = 1, pageSize = 10, filters?: { status?: number; orderType?: number }) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (filters?.status !== undefined) params.set('status', String(filters.status))
    if (filters?.orderType !== undefined) params.set('orderType', String(filters.orderType))
    return request<{ list: any[]; total: number; page: number; pageSize: number }>(
      `/api/admin/orders?${params.toString()}`,
    )
  },
  verifyOrder: (id: number) =>
    request<any>(`/api/admin/orders/${id}/verify`, { method: 'POST' }),
  refundOrder: (id: number) =>
    request<any>(`/api/admin/orders/${id}/refund`, { method: 'PUT' }),
}
