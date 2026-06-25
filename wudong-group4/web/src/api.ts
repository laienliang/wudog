const BASE = '' // Vite proxy handles /api → localhost:3000

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json: ApiResponse<T> = await res.json()
  if (json.code >= 400) {
    throw new Error(json.message || '请求失败')
  }
  return json.data as T
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
}

// ---- 景区 ----

export interface ScenicSpot {
  id: number
  name: string
  coverImage: string
  images: string[] | null
  description: string | null
  address: string
  lat: number | null
  lng: number | null
  status: number
  sort: number
  createdAt: string
  updatedAt: string
}

export const api = {
  getScenicSpots: (page = 1, pageSize = 10) =>
    request<{ list: ScenicSpot[]; total: number; page: number; pageSize: number }>(
      `/api/scenic-spots?page=${page}&pageSize=${pageSize}`,
    ),

  getScenicSpot: (id: number) =>
    request<ScenicSpot & { ticketTypes: any[] }>(`/api/scenic-spots/${id}`),

  // ---- 票种 ----

  getTicketTypes: (scenicId: number) =>
    request<any[]>(`/api/ticket-types?scenicId=${scenicId}`),

  getTicketType: (id: number) =>
    request<any>(`/api/ticket-types/${id}`),

  // ---- 路线 ----

  getRoutes: (page = 1, pageSize = 10) =>
    request<{ list: any[]; total: number; page: number; pageSize: number }>(
      `/api/routes?page=${page}&pageSize=${pageSize}`,
    ),

  getRoute: (id: number) =>
    request<any>(`/api/routes/${id}`),

  // ---- 订单 ----

  createOrder: (data: any) =>
    request<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyOrders: (userId: number, page = 1, pageSize = 10) =>
    request<{ list: any[]; total: number; page: number; pageSize: number }>(
      `/api/orders/my?userId=${userId}&page=${page}&pageSize=${pageSize}`,
    ),

  getOrder: (id: number) =>
    request<any>(`/api/orders/${id}`),

  cancelOrder: (id: number) =>
    request<any>(`/api/orders/${id}/cancel`, { method: 'PUT' }),
}
