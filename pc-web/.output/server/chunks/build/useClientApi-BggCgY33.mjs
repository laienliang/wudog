import { b as useRuntimeConfig } from './server.mjs';

function useClientApi() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;
  async function request(url, query) {
    var _a;
    const res = await $fetch(url, {
      baseURL,
      query
    });
    return (_a = res == null ? void 0 : res.data) != null ? _a : res;
  }
  return {
    home: () => request("/home"),
    search: (keyword) => request("/search", { keyword }),
    page: (type, query = {}) => request("/page", {
      type,
      ...query
    }),
    detail: (type, id) => request("/detail", { type, id }),
    categories: () => request("/categories"),
    cart: (userId) => request("/cart", { userId })
  };
}

export { useClientApi as u };
//# sourceMappingURL=useClientApi-BggCgY33.mjs.map
