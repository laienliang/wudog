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
    const currentRoute = useRoute();
    const routes = [
      {
        id: 1,
        title: "\u4E4C\u4E1C\u82D7\u5BE8\u6DF1\u5EA6\u4E00\u65E5\u6E38",
        image: "https://via.placeholder.com/900x560/F7F8FA/D4A14B?text=\u4E00\u65E5\u6E38",
        days: 1,
        people: "2\u4EBA\u6210\u56E2",
        rating: 4.8,
        price: 298,
        includes: ["\u4E09\u9910", "\u5BFC\u6E38", "\u95E8\u7968", "\u94F6\u9970\u4F53\u9A8C"],
        description: "\u4E00\u5929\u8D70\u8FDB\u4E4C\u4E1C\u82D7\u5BE8\u6838\u5FC3\u4F53\u9A8C\uFF0C\u4ECE\u68AF\u7530\u6668\u666F\u5230\u94F6\u9970\u5DE5\u574A\uFF0C\u518D\u5230\u82D7\u5BB6\u957F\u684C\u5BB4\u3002",
        timeline: [
          { title: "\u4E0A\u5348\uFF1A\u68AF\u7530\u4E0E\u53E4\u5BE8", content: "\u6E38\u89C8\u4E4C\u4E1C\u68AF\u7530\u3001\u98CE\u96E8\u6865\u548C\u540A\u811A\u697C\u5EFA\u7B51\u7FA4\u3002" },
          { title: "\u4E0B\u5348\uFF1A\u975E\u9057\u4F53\u9A8C", content: "\u53C2\u89C2\u94F6\u9970\u953B\u9020\u5DE5\u574A\uFF0C\u4F53\u9A8C\u8721\u67D3\u7EB9\u6837\u5236\u4F5C\u3002" },
          { title: "\u508D\u665A\uFF1A\u957F\u684C\u5BB4", content: "\u54C1\u5C1D\u82D7\u5BB6\u9178\u6C64\u9C7C\u3001\u7CEF\u7C73\u996D\u548C\u8282\u5E86\u5C0F\u98DF\u3002" }
        ]
      },
      {
        id: 2,
        title: "\u82D7\u5BE8+\u68AF\u7530\u5F92\u6B65\u4E24\u65E5\u6E38",
        image: "https://via.placeholder.com/900x560/F7F8FA/D4A14B?text=\u4E24\u65E5\u6E38",
        days: 2,
        nights: 1,
        people: "4\u4EBA\u6210\u56E2",
        rating: 4.9,
        price: 498,
        includes: ["\u4F4F\u5BBF", "\u4E09\u9910", "\u5F92\u6B65", "\u957F\u684C\u5BB4"],
        description: "\u4E24\u5929\u6162\u884C\u4E4C\u4E1C\u5C71\u6C34\uFF0C\u4F4F\u8FDB\u540A\u811A\u697C\u6C11\u5BBF\uFF0C\u5B8C\u6574\u4F53\u9A8C\u82D7\u5BE8\u6E05\u6668\u4E0E\u591C\u665A\u3002",
        timeline: [
          { title: "\u7B2C\u4E00\u5929\uFF1A\u62B5\u8FBE\u4E0E\u591C\u6E38", content: "\u5165\u4F4F\u6C11\u5BBF\uFF0C\u53C2\u52A0\u957F\u684C\u5BB4\u548C\u7BDD\u706B\u4F53\u9A8C\u3002" },
          { title: "\u7B2C\u4E8C\u5929\uFF1A\u68AF\u7530\u5F92\u6B65", content: "\u6CBF\u68AF\u7530\u6B65\u9053\u5F92\u6B65\uFF0C\u8D70\u8BBF\u94F6\u5320\u548C\u8721\u67D3\u5DE5\u574A\u3002" }
        ]
      }
    ];
    const routePlan = computed(() => routes.find((item) => item.id === Number(currentRoute.params.id)) || routes[0]);
    useHead(() => ({ title: `${routePlan.value.title} - \u4E4C\u4E1C\u6587\u65C5` }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-page" }, _attrs))} data-v-9bbddc8a><div class="container detail-wrap" data-v-9bbddc8a>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/travel",
        class: "back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u8FD4\u56DE\u666F\u533A\u7EBF\u8DEF`);
          } else {
            return [
              createTextVNode("\u2190 \u8FD4\u56DE\u666F\u533A\u7EBF\u8DEF")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="route-hero" data-v-9bbddc8a><img${ssrRenderAttr("src", unref(routePlan).image)}${ssrRenderAttr("alt", unref(routePlan).title)} data-v-9bbddc8a><div class="route-panel" data-v-9bbddc8a><span class="eyebrow" data-v-9bbddc8a>\u8DEF\u7EBF\u5957\u9910</span><h1 data-v-9bbddc8a>${ssrInterpolate(unref(routePlan).title)}</h1><p data-v-9bbddc8a>${ssrInterpolate(unref(routePlan).description)}</p><div class="meta-row" data-v-9bbddc8a><span data-v-9bbddc8a>\u{1F4C5} ${ssrInterpolate(unref(routePlan).days)}\u5929${ssrInterpolate(unref(routePlan).nights ? unref(routePlan).nights + "\u665A" : "")}</span><span data-v-9bbddc8a>\u{1F465} ${ssrInterpolate(unref(routePlan).people)}</span><span data-v-9bbddc8a>\u2B50 ${ssrInterpolate(unref(routePlan).rating)}</span></div><div class="include-row" data-v-9bbddc8a><!--[-->`);
      ssrRenderList(unref(routePlan).includes, (item) => {
        _push(`<span data-v-9bbddc8a>${ssrInterpolate(item)}</span>`);
      });
      _push(`<!--]--></div><div class="price-row" data-v-9bbddc8a><strong data-v-9bbddc8a>\xA5${ssrInterpolate(unref(routePlan).price)}</strong><span data-v-9bbddc8a>\u8D77/\u4EBA</span></div><button class="btn btn-primary" type="button" data-v-9bbddc8a>\u7ACB\u5373\u9884\u8BA2</button></div></section><section class="content-card" data-v-9bbddc8a><h2 data-v-9bbddc8a>\u884C\u7A0B\u5B89\u6392</h2><div class="timeline" data-v-9bbddc8a><!--[-->`);
      ssrRenderList(unref(routePlan).timeline, (day) => {
        _push(`<div class="timeline-item" data-v-9bbddc8a><strong data-v-9bbddc8a>${ssrInterpolate(day.title)}</strong><p data-v-9bbddc8a>${ssrInterpolate(day.content)}</p></div>`);
      });
      _push(`<!--]--></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/travel/route/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9bbddc8a"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DRD6d3Xw.mjs.map
