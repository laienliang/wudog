import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useClientApi } from './useClientApi-BggCgY33.mjs';
import { u as useHead } from './v3-nZofQJlQ.mjs';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "list",
  __ssrInlineRender: true,
  setup(__props) {
    const activePrice = ref("all");
    const facilities = ref([]);
    useClientApi();
    const fallbackHostels = [
      { id: 1, name: "\u68AF\u7530\u89C2\u666F\u6C11\u5BBF", mainImage: "https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=\u68AF\u7530\u89C2\u666F", styleTags: ["\u7530\u56ED\u98CE", "\u540A\u811A\u697C"], rating: 4.9, reviewCount: 128, price: 388 },
      { id: 2, name: "\u82D7\u5BE8\u5C0F\u9662", mainImage: "https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=\u82D7\u5BE8\u5C0F\u9662", styleTags: ["\u6C11\u65CF\u98CE", "\u5EAD\u9662"], rating: 4.7, reviewCount: 86, price: 268 },
      { id: 3, name: "\u94F6\u5320\u6728\u5C4B", mainImage: "https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=\u94F6\u5320\u6728\u5C4B", styleTags: ["\u6587\u5316", "\u89C2\u666F"], rating: 4.8, reviewCount: 64, price: 458 },
      { id: 4, name: "\u53E4\u5BE8\u5BA2\u6808", mainImage: "https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=\u53E4\u5BE8\u5BA2\u6808", styleTags: ["\u53E4\u5EFA", "\u7ECF\u6D4E"], rating: 4.3, reviewCount: 210, price: 168 }
    ];
    const hostels = ref(fallbackHostels);
    useHead({
      title: "\u7279\u8272\u6C11\u5BBF - \u4E4C\u4E1C\u6587\u65C5",
      meta: [{ name: "description", content: "\u82D7\u5BE8\u540A\u811A\u697C\u3001\u89C2\u666F\u6728\u5C4B\u3001\u4F20\u7EDF\u5BA2\u6808\u5728\u7EBF\u9884\u8BA2" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lodging-page" }, _attrs))} data-v-fffe8a68><div class="container page-inner" data-v-fffe8a68><div class="page-header" data-v-fffe8a68><h1 data-v-fffe8a68>\u7279\u8272\u6C11\u5BBF</h1><p class="page-desc" data-v-fffe8a68>\u82D7\u5BE8\u540A\u811A\u697C\u3001\u89C2\u666F\u6728\u5C4B\u3001\u4F20\u7EDF\u5BA2\u6808</p></div><div class="miao-divider" data-v-fffe8a68></div><div class="filter-bar" data-v-fffe8a68><div class="filter-group" data-v-fffe8a68><span class="filter-label" data-v-fffe8a68>\u4EF7\u683C\uFF1A</span><button class="${ssrRenderClass(["filter-btn", { active: unref(activePrice) === "all" }])}" data-v-fffe8a68>\u4E0D\u9650</button><button class="${ssrRenderClass(["filter-btn", { active: unref(activePrice) === "200" }])}" data-v-fffe8a68>200\u4EE5\u4E0B</button><button class="${ssrRenderClass(["filter-btn", { active: unref(activePrice) === "500" }])}" data-v-fffe8a68>200-500</button><button class="${ssrRenderClass(["filter-btn", { active: unref(activePrice) === "800" }])}" data-v-fffe8a68>500\u4EE5\u4E0A</button></div><div class="filter-group" data-v-fffe8a68><span class="filter-label" data-v-fffe8a68>\u8BBE\u65BD\uFF1A</span><button class="${ssrRenderClass(["filter-btn", { active: unref(facilities).includes("wifi") }])}" data-v-fffe8a68>WiFi</button><button class="${ssrRenderClass(["filter-btn", { active: unref(facilities).includes("ac") }])}" data-v-fffe8a68>\u7A7A\u8C03</button><button class="${ssrRenderClass(["filter-btn", { active: unref(facilities).includes("bathroom") }])}" data-v-fffe8a68>\u72EC\u7ACB\u536B\u6D74</button></div></div><div class="hostel-grid" data-v-fffe8a68><!--[-->`);
      ssrRenderList(unref(hostels), (item, idx) => {
        _push(`<div class="hostel-card" data-v-fffe8a68>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/lodging/detail/${item.id}`,
          class: "hostel-card-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", item.mainImage)}${ssrRenderAttr("alt", item.name)} class="hostel-img" data-v-fffe8a68${_scopeId}><div class="hostel-body" data-v-fffe8a68${_scopeId}><h3 class="hostel-name" data-v-fffe8a68${_scopeId}>${ssrInterpolate(item.name)}</h3><div class="hostel-tags" data-v-fffe8a68${_scopeId}><!--[-->`);
              ssrRenderList((item.styleTags || []).slice(0, 2), (t, i) => {
                _push2(`<span class="tag tag-primary" data-v-fffe8a68${_scopeId}>${ssrInterpolate(t)}</span>`);
              });
              _push2(`<!--]--></div><div class="hostel-meta" data-v-fffe8a68${_scopeId}><span class="rating" data-v-fffe8a68${_scopeId}>\u2B50 ${ssrInterpolate(item.rating)}</span><span class="reviews" data-v-fffe8a68${_scopeId}>(${ssrInterpolate(item.reviewCount)}\u6761\u8BC4\u4EF7)</span></div><div class="hostel-price-row" data-v-fffe8a68${_scopeId}><span class="price" data-v-fffe8a68${_scopeId}>\xA5${ssrInterpolate(item.price)}</span><span class="price-unit" data-v-fffe8a68${_scopeId}>\u8D77/\u665A</span></div></div>`);
            } else {
              return [
                createVNode("img", {
                  src: item.mainImage,
                  alt: item.name,
                  class: "hostel-img"
                }, null, 8, ["src", "alt"]),
                createVNode("div", { class: "hostel-body" }, [
                  createVNode("h3", { class: "hostel-name" }, toDisplayString(item.name), 1),
                  createVNode("div", { class: "hostel-tags" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList((item.styleTags || []).slice(0, 2), (t, i) => {
                      return openBlock(), createBlock("span", {
                        class: "tag tag-primary",
                        key: i
                      }, toDisplayString(t), 1);
                    }), 128))
                  ]),
                  createVNode("div", { class: "hostel-meta" }, [
                    createVNode("span", { class: "rating" }, "\u2B50 " + toDisplayString(item.rating), 1),
                    createVNode("span", { class: "reviews" }, "(" + toDisplayString(item.reviewCount) + "\u6761\u8BC4\u4EF7)", 1)
                  ]),
                  createVNode("div", { class: "hostel-price-row" }, [
                    createVNode("span", { class: "price" }, "\xA5" + toDisplayString(item.price), 1),
                    createVNode("span", { class: "price-unit" }, "\u8D77/\u665A")
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lodging/list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const list = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fffe8a68"]]);

export { list as default };
//# sourceMappingURL=list-CikGk4o6.mjs.map
