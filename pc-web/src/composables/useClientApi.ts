type ApiResponse<T> = {
  code?: number;
  data?: T;
  message?: string;
};

export type ClientCard = {
  id: number;
  type: string;
  typeName: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  images?: string[];
  price?: number;
  rating?: number;
  sales?: number;
  likes?: number;
  comments?: number;
  address?: string;
  meta?: string;
  path: string;
};

export function useClientApi() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase as string;

  async function request<T>(url: string, query?: Record<string, unknown>) {
    const res = await $fetch<ApiResponse<T>>(url, {
      baseURL,
      query,
    });

    return (res?.data ?? res) as T;
  }

  async function post<T>(url: string, body?: Record<string, unknown>) {
    const res = await $fetch<ApiResponse<T>>(url, {
      baseURL,
      method: 'POST',
      body,
    });

    return (res?.data ?? res) as T;
  }

  return {
    home: () =>
      request<{
        banners: Array<{ id: number; title: string; image: string; link?: string }>;
        hot: Record<string, ClientCard[]>;
        articles: ClientCard[];
      }>('/home'),
    search: (keyword: string) => request<{ list: ClientCard[] }>('/search', { keyword }),
    page: (type: string, query: Record<string, unknown> = {}) =>
      request<{ list: ClientCard[]; pagination: { total: number; page: number; pageSize: number } }>('/page', {
        type,
        ...query,
      }),
    detail: (type: string, id: string | number) => request<ClientCard & Record<string, any>>('/detail', { type, id }),
    categories: () => request<{ clothing: Array<{ id: number; name: string }>; topics: any[] }>('/categories'),
    cart: (userId: number) => request<{ list: any[] }>('/cart', { userId }),
    addCart: (body: { userId: number; goodsId: number; moduleType?: number; skuId?: number; skuName?: string; quantity?: number }) =>
      post<{ success: boolean; item: any }>('/cart/add', body),
    collectStatus: (userId: number, goodsId: number) => request<{ collected: boolean }>('/collect/status', { userId, goodsId }),
    toggleCollect: (body: { userId: number; goodsId: number }) => post<{ success: boolean; collected: boolean }>('/collect/toggle', body),
  };
}
