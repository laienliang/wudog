import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, d as useRoute } from './server.mjs';
import { u as useClientApi } from './useClientApi-BggCgY33.mjs';
import { u as useHead } from './v3-nZofQJlQ.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "search",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const clientApi = useClientApi();
    const searchText = ref(String(route.query.q || ""));
    const activeType = ref("all");
    const remoteResults = ref([]);
    const tabs = [
      { label: "\u5168\u90E8", value: "all" },
      { label: "\u5546\u54C1", value: "goods" },
      { label: "\u9910\u5385", value: "food" },
      { label: "\u6C11\u5BBF", value: "lodging" },
      { label: "\u7EBF\u8DEF", value: "travel" },
      { label: "\u793E\u533A", value: "community" }
    ];
    const fallbackResults = [
      {
        id: 1,
        type: "goods",
        typeLabel: "\u975E\u9057\u5546\u54C1",
        title: "\u82D7\u65CF\u526A\u7EB8\u88C5\u9970\u753B",
        description: "\u4EE5\u82D7\u5BE8\u5C71\u6C34\u548C\u94F6\u9970\u7EB9\u6837\u4E3A\u7075\u611F\u7684\u624B\u5DE5\u526A\u7EB8\u88C5\u9970\u753B\uFF0C\u9002\u5408\u5BA2\u5385\u3001\u4E66\u623F\u548C\u6C11\u5BBF\u8F6F\u88C5\u3002",
        meta: "\u5DF2\u552E 96",
        price: 158,
        image: "https://via.placeholder.com/600x420/F7F8FA/1F5FA8?text=\u526A\u7EB8\u88C5\u9970\u753B",
        path: "/clothing/list",
        keywords: ["\u526A\u7EB8", "\u88C5\u9970\u753B", "\u975E\u9057", "\u624B\u5DE5", "\u82D7\u65CF"]
      },
      {
        id: 2,
        type: "goods",
        typeLabel: "\u975E\u9057\u5546\u54C1",
        title: "\u8721\u67D3\u5E03\u827A\u6302\u753B",
        description: "\u5929\u7136\u690D\u7269\u67D3\u6599\u5236\u4F5C\uFF0C\u7EB9\u6837\u6765\u81EA\u82D7\u65CF\u4F20\u7EDF\u56FE\u6848\u3002",
        meta: "\u5DF2\u552E 86",
        price: 198,
        image: "https://via.placeholder.com/600x420/F7F8FA/1F5FA8?text=\u8721\u67D3\u6302\u753B",
        path: "/clothing/list",
        keywords: ["\u8721\u67D3", "\u6302\u753B", "\u88C5\u9970\u753B", "\u5E03\u827A"]
      },
      {
        id: 3,
        type: "food",
        typeLabel: "\u7F8E\u98DF\u9910\u5385",
        title: "\u82D7\u5BB6\u5927\u9662",
        description: "\u6B63\u5B97\u82D7\u5BB6\u957F\u684C\u5BB4\uFF0C\u9002\u5408\u5BB6\u5EAD\u805A\u9910\u548C\u56E2\u961F\u4F53\u9A8C\u3002",
        meta: "\u8BC4\u5206 4.8 \xB7 500m",
        image: "https://via.placeholder.com/600x420/FFF1EA/E85D2F?text=\u82D7\u5BB6\u5927\u9662",
        path: "/food/restaurant",
        keywords: ["\u9910\u5385", "\u957F\u684C\u5BB4", "\u82D7\u5BB6\u83DC", "\u7F8E\u98DF"]
      },
      {
        id: 4,
        type: "lodging",
        typeLabel: "\u7279\u8272\u6C11\u5BBF",
        title: "\u5C71\u666F\u540A\u811A\u697C\u6C11\u5BBF",
        description: "\u4E34\u8FD1\u68AF\u7530\u89C2\u666F\u53F0\uFF0C\u4FDD\u7559\u4F20\u7EDF\u540A\u811A\u697C\u6728\u6784\u7A7A\u95F4\u3002",
        meta: "\u53EF\u4F4F 2-4 \u4EBA",
        price: 368,
        image: "https://via.placeholder.com/600x420/E8F1FB/1F5FA8?text=\u540A\u811A\u697C\u6C11\u5BBF",
        path: "/lodging/list",
        keywords: ["\u6C11\u5BBF", "\u540A\u811A\u697C", "\u4F4F\u5BBF", "\u5C71\u666F"]
      },
      {
        id: 5,
        type: "travel",
        typeLabel: "\u65C5\u6E38\u7EBF\u8DEF",
        title: "\u4E4C\u4E1C\u82D7\u5BE8\u4E00\u65E5\u6E38",
        description: "\u94F6\u9970\u5DE5\u574A\u3001\u8721\u67D3\u4F53\u9A8C\u3001\u68AF\u7530\u5F92\u6B65\u548C\u957F\u684C\u5BB4\u7EC4\u5408\u7EBF\u8DEF\u3002",
        meta: "\u7EA6 6 \u5C0F\u65F6",
        price: 128,
        image: "https://via.placeholder.com/600x420/F6FFED/6B8E3D?text=\u82D7\u5BE8\u7EBF\u8DEF",
        path: "/travel",
        keywords: ["\u65C5\u6E38", "\u7EBF\u8DEF", "\u4E00\u65E5\u6E38", "\u68AF\u7530", "\u4F53\u9A8C"]
      },
      {
        id: 6,
        type: "community",
        typeLabel: "\u793E\u533A\u6E38\u8BB0",
        title: "\u5728\u4E4C\u4E1C\u6751\u9047\u89C1\u4E00\u5E45\u4F1A\u547C\u5438\u7684\u5C71\u6C34\u753B",
        description: "\u6E38\u5BA2\u5206\u4EAB\u82D7\u5BE8\u6E05\u6668\u3001\u68AF\u7530\u6B65\u9053\u548C\u975E\u9057\u5DE5\u574A\u4F53\u9A8C\u3002",
        meta: "128 \u8D5E \xB7 24 \u8BC4",
        image: "https://via.placeholder.com/600x420/FFF7E6/D4A14B?text=\u4E4C\u4E1C\u6E38\u8BB0",
        path: "/community/feed",
        keywords: ["\u6E38\u8BB0", "\u793E\u533A", "\u5C71\u6C34", "\u82D7\u5BE8"]
      }
    ];
    const keyword = computed(() => String(route.query.q || "").trim());
    const localResults = computed(() => {
      const value = keyword.value.toLowerCase();
      if (!value) return fallbackResults;
      return fallbackResults.filter((item) => {
        const text = [item.title, item.description, item.typeLabel, ...item.keywords].join(" ").toLowerCase();
        return text.includes(value) || value.split(/\s+/).some((word) => text.includes(word));
      });
    });
    const filteredResults = computed(() => remoteResults.value.length ? remoteResults.value : localResults.value);
    const visibleResults = computed(() => {
      if (activeType.value === "all") return filteredResults.value;
      return filteredResults.value.filter((item) => item.type === activeType.value);
    });
    watch(
      () => route.query.q,
      (value) => {
        searchText.value = String(value || "");
        activeType.value = "all";
        loadSearch();
      }
    );
    async function loadSearch() {
      const value = keyword.value;
      if (!value) {
        remoteResults.value = [];
        return;
      }
      try {
        const res = await clientApi.search(value);
        remoteResults.value = ((res == null ? void 0 : res.list) || []).map((item) => ({
          id: item.id,
          type: mapType(item.type),
          typeLabel: item.typeName,
          title: item.title,
          description: item.description || item.subtitle || "",
          meta: item.meta || "",
          price: item.price,
          image: item.image || "",
          path: item.path,
          keywords: [item.title, item.typeName, item.description || ""]
        }));
      } catch (err) {
        remoteResults.value = [];
      }
    }
    function mapType(type) {
      if (type === "restaurant" || type === "agriculture") return "food";
      if (type === "lodging") return "lodging";
      if (type === "scenic" || type === "route" || type === "guide") return "travel";
      if (type === "article") return "community";
      return "goods";
    }
    useHead(() => ({
      title: `${keyword.value || "\u641C\u7D22"} - \u4E4C\u4E1C\u6587\u65C5`,
      meta: [{ name: "description", content: "\u4E4C\u4E1C\u6587\u65C5\u7EFC\u5408\u641C\u7D22\uFF0C\u67E5\u627E\u975E\u9057\u5546\u54C1\u3001\u7F8E\u98DF\u9910\u5385\u3001\u7279\u8272\u6C11\u5BBF\u3001\u65C5\u6E38\u7EBF\u8DEF\u548C\u793E\u533A\u6E38\u8BB0\u3002" }]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "search-page" }, _attrs))} data-v-3344388f><div class="container page-inner" data-v-3344388f><section class="search-hero" data-v-3344388f><div data-v-3344388f><span class="search-kicker" data-v-3344388f>\u7EFC\u5408\u68C0\u7D22</span><h1 data-v-3344388f>\u641C\u7D22\u201C${ssrInterpolate(unref(keyword) || "\u4E4C\u4E1C\u6587\u65C5")}\u201D</h1><p data-v-3344388f>\u4ECE\u975E\u9057\u5546\u54C1\u3001\u7F8E\u98DF\u9910\u5385\u3001\u7279\u8272\u6C11\u5BBF\u3001\u65C5\u6E38\u7EBF\u8DEF\u548C\u793E\u533A\u6E38\u8BB0\u4E2D\u67E5\u627E\u76F8\u5173\u5185\u5BB9\u3002</p></div><div class="search-card" data-v-3344388f><input${ssrRenderAttr("value", unref(searchText))} type="text" placeholder="\u641C\u7D22\u5546\u54C1/\u9910\u5385/\u6C11\u5BBF/\u7EBF\u8DEF" data-v-3344388f><button type="button" data-v-3344388f>\u641C\u7D22</button></div></section><div class="miao-divider" data-v-3344388f></div><div class="search-summary" data-v-3344388f><span data-v-3344388f>\u5171\u627E\u5230 ${ssrInterpolate(unref(filteredResults).length)} \u6761\u76F8\u5173\u7ED3\u679C</span><div class="search-tabs" data-v-3344388f><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass(["search-tab", { active: unref(activeType) === tab.value }])}" type="button" data-v-3344388f>${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(visibleResults).length) {
        _push(`<div class="result-grid" data-v-3344388f><!--[-->`);
        ssrRenderList(unref(visibleResults), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: `${item.type}-${item.id}`,
            to: item.path,
            class: "result-card"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.title)} class="result-cover" data-v-3344388f${_scopeId}><div class="result-body" data-v-3344388f${_scopeId}><span class="result-type" data-v-3344388f${_scopeId}>${ssrInterpolate(item.typeLabel)}</span><h2 data-v-3344388f${_scopeId}>${ssrInterpolate(item.title)}</h2><p data-v-3344388f${_scopeId}>${ssrInterpolate(item.description)}</p><div class="result-meta" data-v-3344388f${_scopeId}><span data-v-3344388f${_scopeId}>${ssrInterpolate(item.meta)}</span>`);
                if (item.price) {
                  _push2(`<strong data-v-3344388f${_scopeId}>\xA5${ssrInterpolate(item.price)}</strong>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("img", {
                    src: item.image,
                    alt: item.title,
                    class: "result-cover"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "result-body" }, [
                    createVNode("span", { class: "result-type" }, toDisplayString(item.typeLabel), 1),
                    createVNode("h2", null, toDisplayString(item.title), 1),
                    createVNode("p", null, toDisplayString(item.description), 1),
                    createVNode("div", { class: "result-meta" }, [
                      createVNode("span", null, toDisplayString(item.meta), 1),
                      item.price ? (openBlock(), createBlock("strong", { key: 0 }, "\xA5" + toDisplayString(item.price), 1)) : createCommentVNode("", true)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty-state" data-v-3344388f><h2 data-v-3344388f>\u6682\u672A\u627E\u5230\u76F8\u5173\u5185\u5BB9</h2><p data-v-3344388f>\u6362\u4E00\u4E2A\u5173\u952E\u8BCD\u8BD5\u8BD5\uFF0C\u6BD4\u5982\u201C\u94F6\u9970\u201D\u201C\u957F\u684C\u5BB4\u201D\u201C\u6C11\u5BBF\u201D\u3002</p></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const search = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3344388f"]]);

export { search as default };
//# sourceMappingURL=search-DjgnV9mY.mjs.map
