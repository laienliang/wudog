import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "restaurant",
  __ssrInlineRender: true,
  setup(__props) {
    const restaurants = ref([
      { id: 1, name: "\u82D7\u5BB6\u5927\u9662", cover: "https://via.placeholder.com/600x400/FFF1EA/E85D2F?text=\u82D7\u5BB6\u5927\u9662", tags: ["\u957F\u684C\u5BB4", "\u82D7\u5BB6\u83DC"], rating: 4.8, distance: "500m", description: "\u6B63\u5B97\u82D7\u5BB6\u83DC\uFF0C\u7279\u8272\u957F\u684C\u5BB4\uFF0C\u4F53\u9A8C\u6700\u5730\u9053\u7684\u4E4C\u4E1C\u98CE\u5473\u3002" },
      { id: 2, name: "\u68AF\u7530\u4EBA\u5BB6", cover: "https://via.placeholder.com/600x400/E8F1FB/1F5FA8?text=\u68AF\u7530\u4EBA\u5BB6", tags: ["\u519C\u5BB6\u83DC", "\u89C2\u666F"], rating: 4.5, distance: "800m", description: "\u5750\u62E5\u68AF\u7530\u7F8E\u666F\uFF0C\u98DF\u6750\u5168\u90E8\u6765\u81EA\u672C\u5730\u519C\u5BB6\u3002" },
      { id: 3, name: "\u94F6\u5320\u53A8\u623F", cover: "https://via.placeholder.com/600x400/FFF7E6/D4A14B?text=\u94F6\u5320\u53A8\u623F", tags: ["\u94F6\u9970\u4F53\u9A8C", "\u7F8E\u98DF"], rating: 4.9, distance: "300m", description: "\u8FB9\u770B\u94F6\u9970\u953B\u9020\u8FB9\u54C1\u5C1D\u82D7\u5BB6\u7F8E\u98DF\uFF0C\u72EC\u7279\u4F53\u9A8C\u3002" },
      { id: 4, name: "\u8721\u67D3\u5C0F\u9986", cover: "https://via.placeholder.com/600x400/F6FFED/6B8E3D?text=\u8721\u67D3\u5C0F\u9986", tags: ["\u8721\u67D3\u4F53\u9A8C", "\u7D20\u98DF"], rating: 4.6, distance: "600m", description: "\u7ED3\u5408\u8721\u67D3\u827A\u672F\u7684\u7D20\u98DF\u9910\u5385\uFF0C\u6E05\u65B0\u96C5\u81F4\u3002" }
    ]);
    useHead({
      title: "\u7F8E\u98DF\u9910\u5385 - \u4E4C\u4E1C\u6587\u65C5",
      meta: [{ name: "description", content: "\u82D7\u5BB6\u957F\u684C\u5BB4\u3001\u519C\u5BB6\u7279\u8272\u83DC\u3001\u519C\u4EA7\u54C1\u7279\u4EA7" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "food-restaurant-page" }, _attrs))} data-v-114e101f><div class="container page-inner" data-v-114e101f><div class="page-header" data-v-114e101f><h1 data-v-114e101f>\u7F8E\u98DF\u9910\u5385</h1><p class="page-desc" data-v-114e101f>\u82D7\u5BB6\u957F\u684C\u5BB4\u3001\u519C\u5BB6\u7279\u8272\u83DC\u3001\u519C\u4EA7\u54C1\u7279\u4EA7</p></div><div class="miao-divider" data-v-114e101f></div><div class="restaurant-grid" data-v-114e101f><!--[-->`);
      ssrRenderList(unref(restaurants), (item, idx) => {
        _push(`<div class="restaurant-card" data-v-114e101f>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/food/restaurant/${item.id}`,
          class: "restaurant-card-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", item.cover)}${ssrRenderAttr("alt", item.name)} class="restaurant-cover" data-v-114e101f${_scopeId}><div class="restaurant-body" data-v-114e101f${_scopeId}><h3 class="restaurant-name" data-v-114e101f${_scopeId}>${ssrInterpolate(item.name)}</h3><div class="restaurant-tags" data-v-114e101f${_scopeId}><!--[-->`);
              ssrRenderList(item.tags, (t, i) => {
                _push2(`<span class="tag" data-v-114e101f${_scopeId}>${ssrInterpolate(t)}</span>`);
              });
              _push2(`<!--]--></div><div class="restaurant-meta" data-v-114e101f${_scopeId}><span class="rating" data-v-114e101f${_scopeId}>\u2B50 ${ssrInterpolate(item.rating)}</span><span class="distance" data-v-114e101f${_scopeId}>\u{1F4CD} ${ssrInterpolate(item.distance)}</span></div><p class="restaurant-desc" data-v-114e101f${_scopeId}>${ssrInterpolate(item.description)}</p></div>`);
            } else {
              return [
                createVNode("img", {
                  src: item.cover,
                  alt: item.name,
                  class: "restaurant-cover"
                }, null, 8, ["src", "alt"]),
                createVNode("div", { class: "restaurant-body" }, [
                  createVNode("h3", { class: "restaurant-name" }, toDisplayString(item.name), 1),
                  createVNode("div", { class: "restaurant-tags" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(item.tags, (t, i) => {
                      return openBlock(), createBlock("span", {
                        class: "tag",
                        key: i
                      }, toDisplayString(t), 1);
                    }), 128))
                  ]),
                  createVNode("div", { class: "restaurant-meta" }, [
                    createVNode("span", { class: "rating" }, "\u2B50 " + toDisplayString(item.rating), 1),
                    createVNode("span", { class: "distance" }, "\u{1F4CD} " + toDisplayString(item.distance), 1)
                  ]),
                  createVNode("p", { class: "restaurant-desc" }, toDisplayString(item.description), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/food/restaurant.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const restaurant = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-114e101f"]]);

export { restaurant as default };
//# sourceMappingURL=restaurant-DM2AxSLU.mjs.map
