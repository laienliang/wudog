import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc, d as useRoute } from './server.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const restaurants = [
      { id: 1, name: "\u82D7\u5BB6\u5927\u9662", cover: "https://via.placeholder.com/900x560/FFF1EA/E85D2F?text=\u82D7\u5BB6\u5927\u9662", tags: ["\u957F\u684C\u5BB4", "\u82D7\u5BB6\u83DC"], rating: 4.8, distance: "500m", avg: 88, description: "\u6B63\u5B97\u82D7\u5BB6\u83DC\uFF0C\u7279\u8272\u957F\u684C\u5BB4\uFF0C\u9002\u5408\u5BB6\u5EAD\u805A\u9910\u548C\u56E2\u961F\u4F53\u9A8C\u3002", menu: [{ name: "\u9178\u6C64\u9C7C", price: 128 }, { name: "\u82D7\u5BB6\u814A\u8089", price: 68 }, { name: "\u7CEF\u7C73\u996D", price: 28 }] },
      { id: 2, name: "\u68AF\u7530\u4EBA\u5BB6", cover: "https://via.placeholder.com/900x560/E8F1FB/1F5FA8?text=\u68AF\u7530\u4EBA\u5BB6", tags: ["\u519C\u5BB6\u83DC", "\u89C2\u666F"], rating: 4.5, distance: "800m", avg: 76, description: "\u5750\u62E5\u68AF\u7530\u7F8E\u666F\uFF0C\u98DF\u6750\u5168\u90E8\u6765\u81EA\u672C\u5730\u519C\u5BB6\u3002", menu: [{ name: "\u68AF\u7530\u7A3B\u82B1\u9C7C", price: 118 }, { name: "\u65F6\u4EE4\u91CE\u83DC", price: 36 }] }
    ];
    const restaurant = computed(() => restaurants.find((item) => item.id === Number(route.params.id)) || restaurants[0]);
    useHead(() => ({ title: `${restaurant.value.name} - \u4E4C\u4E1C\u6587\u65C5` }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-page" }, _attrs))} data-v-14a516e9><div class="container detail-wrap" data-v-14a516e9>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/food/restaurant",
        class: "back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u8FD4\u56DE\u7F8E\u98DF\u9910\u5385`);
          } else {
            return [
              createTextVNode("\u2190 \u8FD4\u56DE\u7F8E\u98DF\u9910\u5385")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="restaurant-hero" data-v-14a516e9><img${ssrRenderAttr("src", unref(restaurant).cover)}${ssrRenderAttr("alt", unref(restaurant).name)} data-v-14a516e9><div class="hero-copy" data-v-14a516e9><span class="eyebrow" data-v-14a516e9>\u82D7\u5BB6\u98CE\u5473</span><h1 data-v-14a516e9>${ssrInterpolate(unref(restaurant).name)}</h1><p data-v-14a516e9>${ssrInterpolate(unref(restaurant).description)}</p><div class="meta-row" data-v-14a516e9><span data-v-14a516e9>\u2B50 ${ssrInterpolate(unref(restaurant).rating)}</span><span data-v-14a516e9>\u{1F4CD} ${ssrInterpolate(unref(restaurant).distance)}</span><span data-v-14a516e9>\u4EBA\u5747 \xA5${ssrInterpolate(unref(restaurant).avg)}</span></div><div class="tag-row" data-v-14a516e9><!--[-->`);
      ssrRenderList(unref(restaurant).tags, (tag) => {
        _push(`<span class="tag tag-orange" data-v-14a516e9>${ssrInterpolate(tag)}</span>`);
      });
      _push(`<!--]--></div><button class="btn btn-primary" type="button" data-v-14a516e9>\u9884\u8BA2\u9910\u4F4D</button></div></section><section class="menu-card" data-v-14a516e9><h2 data-v-14a516e9>\u62DB\u724C\u63A8\u8350</h2><div class="menu-grid" data-v-14a516e9><!--[-->`);
      ssrRenderList(unref(restaurant).menu, (dish) => {
        _push(`<div class="menu-item" data-v-14a516e9><strong data-v-14a516e9>${ssrInterpolate(dish.name)}</strong><span data-v-14a516e9>\xA5${ssrInterpolate(dish.price)}</span></div>`);
      });
      _push(`<!--]--></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/food/restaurant/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-14a516e9"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CEfkC_DO.mjs.map
