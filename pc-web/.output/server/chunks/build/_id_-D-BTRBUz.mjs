import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useClientApi();
    const hostels = [
      { id: 1, name: "\u68AF\u7530\u89C2\u666F\u6C11\u5BBF", image: "https://via.placeholder.com/900x560/F7F8FA/6B8E3D?text=\u68AF\u7530\u89C2\u666F", price: 388, tags: ["\u7530\u56ED\u98CE", "\u540A\u811A\u697C"], description: "\u63A8\u7A97\u53EF\u89C1\u68AF\u7530\u4E0E\u5C71\u96FE\uFF0C\u9002\u5408\u5468\u672B\u6162\u65C5\u884C\u3002", features: ["\u72EC\u7ACB\u536B\u6D74", "\u89C2\u666F\u9732\u53F0", "\u65E9\u9910", "WiFi"] },
      { id: 2, name: "\u82D7\u5BE8\u5C0F\u9662", image: "https://via.placeholder.com/900x560/F7F8FA/6B8E3D?text=\u82D7\u5BE8\u5C0F\u9662", price: 268, tags: ["\u6C11\u65CF\u98CE", "\u5EAD\u9662"], description: "\u5B89\u9759\u5C0F\u9662\uFF0C\u4E34\u8FD1\u53E4\u5BE8\u6B65\u9053\u548C\u624B\u4F5C\u5DE5\u574A\u3002", features: ["\u5EAD\u9662", "\u7A7A\u8C03", "\u8336\u5BA4", "\u63A5\u9001\u54A8\u8BE2"] }
    ];
    const hostel = ref(hostels.find((item) => item.id === Number(route.params.id)) || hostels[0]);
    useHead(() => ({ title: `${hostel.value.name} - \u4E4C\u4E1C\u6587\u65C5` }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-page" }, _attrs))} data-v-62f3bf5b><div class="container detail-wrap" data-v-62f3bf5b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/lodging/list",
        class: "back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u8FD4\u56DE\u7279\u8272\u6C11\u5BBF`);
          } else {
            return [
              createTextVNode("\u2190 \u8FD4\u56DE\u7279\u8272\u6C11\u5BBF")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="lodging-hero" data-v-62f3bf5b><img${ssrRenderAttr("src", unref(hostel).image)}${ssrRenderAttr("alt", unref(hostel).name)} data-v-62f3bf5b><div class="booking-card" data-v-62f3bf5b><span class="eyebrow" data-v-62f3bf5b>\u7279\u8272\u6C11\u5BBF</span><h1 data-v-62f3bf5b>${ssrInterpolate(unref(hostel).name)}</h1><p data-v-62f3bf5b>${ssrInterpolate(unref(hostel).description)}</p><div class="tag-row" data-v-62f3bf5b><!--[-->`);
      ssrRenderList(unref(hostel).tags, (tag) => {
        _push(`<span class="tag tag-primary" data-v-62f3bf5b>${ssrInterpolate(tag)}</span>`);
      });
      _push(`<!--]--></div><div class="price-row" data-v-62f3bf5b><strong data-v-62f3bf5b>\xA5${ssrInterpolate(unref(hostel).price)}</strong><span data-v-62f3bf5b>\u8D77/\u665A</span></div><button class="btn btn-primary" type="button" data-v-62f3bf5b>\u7ACB\u5373\u9884\u8BA2</button></div></section><section class="content-card" data-v-62f3bf5b><h2 data-v-62f3bf5b>\u623F\u6E90\u4EAE\u70B9</h2><div class="feature-grid" data-v-62f3bf5b><!--[-->`);
      ssrRenderList(unref(hostel).features, (feature) => {
        _push(`<span data-v-62f3bf5b>${ssrInterpolate(feature)}</span>`);
      });
      _push(`<!--]--></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lodging/detail/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-62f3bf5b"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-D-BTRBUz.mjs.map
