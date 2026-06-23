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
    const goodsMap = [
      { id: 1, title: "\u82D7\u65CF\u94F6\u9970\u624B\u956F", subtitle: "\u624B\u5DE5\u953B\u9020\uFF0C\u4F20\u627F\u767E\u5E74\u5DE5\u827A", price: 368, sales: 128, image: "https://via.placeholder.com/720x560/F7F8FA/1F5FA8?text=\u94F6\u9970\u624B\u956F", tags: ["\u94F6\u9970", "\u624B\u5DE5\u953B\u9020", "\u4F34\u624B\u793C"], detail: "\u7531\u4E4C\u4E1C\u94F6\u5320\u91C7\u7528\u4F20\u7EDF\u933E\u523B\u5DE5\u827A\u5236\u4F5C\uFF0C\u7EB9\u6837\u53D6\u81EA\u82D7\u65CF\u5C71\u6C34\u3001\u8774\u8776\u4E0E\u8C37\u7A57\u56FE\u817E\u3002", features: ["\u8DB3\u94F6\u6750\u8D28\uFF0C\u624B\u5DE5\u6253\u78E8", "\u9644\u8D60\u5DE5\u574A\u6EAF\u6E90\u5361", "\u9002\u5408\u65E5\u5E38\u4F69\u6234\u548C\u8282\u5E86\u642D\u914D"] },
      { id: 2, title: "\u8721\u67D3\u5E03\u827A\u6302\u753B", subtitle: "\u5929\u7136\u690D\u7269\u67D3\u6599\uFF0C\u7EAF\u624B\u5DE5\u5236\u4F5C", price: 198, sales: 86, image: "https://via.placeholder.com/720x560/F7F8FA/1F5FA8?text=\u8721\u67D3\u6302\u753B", tags: ["\u8721\u67D3", "\u5BB6\u5C45\u88C5\u9970", "\u690D\u7269\u67D3"], detail: "\u91C7\u7528\u4F20\u7EDF\u8721\u5200\u7ED8\u5236\u7EB9\u6837\uFF0C\u7ECF\u591A\u6B21\u6D78\u67D3\u548C\u8131\u8721\u5B8C\u6210\uFF0C\u9002\u5408\u5BA2\u5385\u3001\u4E66\u623F\u4E0E\u6C11\u5BBF\u7A7A\u95F4\u3002", features: ["\u5929\u7136\u690D\u7269\u67D3\u6599", "\u6BCF\u5E45\u7EB9\u7406\u7565\u6709\u4E0D\u540C", "\u652F\u6301\u88C5\u88F1\u642D\u914D"] },
      { id: 3, title: "\u82D7\u65CF\u523A\u7EE3\u9999\u5305", subtitle: "\u7CBE\u7F8E\u523A\u7EE3\uFF0C\u5929\u7136\u9999\u6599\u586B\u5145", price: 68, sales: 256, image: "https://via.placeholder.com/720x560/F7F8FA/1F5FA8?text=\u523A\u7EE3\u9999\u5305", tags: ["\u523A\u7EE3", "\u9999\u5305", "\u8282\u5E86\u793C\u7269"], detail: "\u5C0F\u5DE7\u9999\u5305\u7531\u5F53\u5730\u7EE3\u5A18\u624B\u5DE5\u7F1D\u5236\uFF0C\u5185\u7F6E\u8349\u672C\u9999\u6599\uFF0C\u9002\u5408\u968F\u8EAB\u4F69\u6234\u3002", features: ["\u624B\u5DE5\u523A\u7EE3", "\u8349\u672C\u9999\u6599", "\u591A\u8272\u53EF\u9009"] }
    ];
    const goods = ref(goodsMap.find((item) => item.id === Number(route.params.id)) || goodsMap[0]);
    useHead(() => ({
      title: `${goods.value.title} - \u4E4C\u4E1C\u6587\u65C5`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "detail-page" }, _attrs))} data-v-1174b037><div class="container detail-wrap" data-v-1174b037>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/clothing/list",
        class: "back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u8FD4\u56DE\u975E\u9057\u5546\u54C1`);
          } else {
            return [
              createTextVNode("\u2190 \u8FD4\u56DE\u975E\u9057\u5546\u54C1")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="detail-hero" data-v-1174b037><img${ssrRenderAttr("src", unref(goods).image)}${ssrRenderAttr("alt", unref(goods).title)} class="detail-image" data-v-1174b037><div class="detail-panel" data-v-1174b037><span class="eyebrow" data-v-1174b037>\u975E\u9057\u624B\u4F5C</span><h1 data-v-1174b037>${ssrInterpolate(unref(goods).title)}</h1><p class="subtitle" data-v-1174b037>${ssrInterpolate(unref(goods).subtitle)}</p><div class="tag-row" data-v-1174b037><!--[-->`);
      ssrRenderList(unref(goods).tags, (tag) => {
        _push(`<span class="tag" data-v-1174b037>${ssrInterpolate(tag)}</span>`);
      });
      _push(`<!--]--></div><div class="price-row" data-v-1174b037><strong data-v-1174b037>\xA5${ssrInterpolate(unref(goods).price)}</strong><span data-v-1174b037>\u5DF2\u552E ${ssrInterpolate(unref(goods).sales)} \u4EF6</span></div><div class="action-row" data-v-1174b037>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cart",
        class: "btn btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u52A0\u5165\u8D2D\u7269\u8F66`);
          } else {
            return [
              createTextVNode("\u52A0\u5165\u8D2D\u7269\u8F66")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="btn btn-outline" type="button" data-v-1174b037>\u6536\u85CF</button></div></div></section><section class="content-grid" data-v-1174b037><article class="content-card" data-v-1174b037><h2 data-v-1174b037>\u5546\u54C1\u8BE6\u60C5</h2><p data-v-1174b037>${ssrInterpolate(unref(goods).detail)}</p><ul data-v-1174b037><!--[-->`);
      ssrRenderList(unref(goods).features, (item) => {
        _push(`<li data-v-1174b037>${ssrInterpolate(item)}</li>`);
      });
      _push(`<!--]--></ul></article><aside class="content-card" data-v-1174b037><h2 data-v-1174b037>\u670D\u52A1\u4FDD\u969C</h2><p data-v-1174b037>\u652F\u6301\u672C\u5730\u5546\u5BB6\u53D1\u8D27\u3001\u7834\u635F\u8865\u5BC4\u3001\u975E\u9057\u5DE5\u574A\u6EAF\u6E90\u5C55\u793A\u3002</p></aside></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/clothing/detail/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1174b037"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-ThPSp8lM.mjs.map
