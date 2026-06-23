import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("scenic");
    useClientApi();
    const fallbackScenicList = [
      { id: 1, name: "\u4E4C\u4E1C\u68AF\u7530\u666F\u533A", mainImage: "https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=\u68AF\u7530", address: "\u8D35\u5DDE\u7701\u9ED4\u4E1C\u5357\u5DDE", rating: 4.8, openHours: "06:00-18:00", description: "\u5343\u5E74\u68AF\u7530\uFF0C\u56DB\u5B63\u98CE\u5149\u5404\u5F02\uFF0C\u6625\u5B63\u704C\u6C34\u5982\u955C\uFF0C\u79CB\u5B63\u91D1\u9EC4\u5982\u753B\u3002" },
      { id: 2, name: "\u82D7\u5BE8\u53E4\u6751\u843D", mainImage: "https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=\u53E4\u6751\u843D", address: "\u4E4C\u4E1C\u6751\u5185", rating: 4.6, openHours: "\u5168\u5929\u5F00\u653E", description: "\u4FDD\u5B58\u5B8C\u597D\u7684\u82D7\u65CF\u53E4\u5EFA\u7B51\u7FA4\uFF0C\u540A\u811A\u697C\u3001\u98CE\u96E8\u6865\u3001\u9F13\u697C\u4E00\u5E94\u4FF1\u5168\u3002" }
    ];
    const fallbackRouteList = [
      { id: 1, title: "\u4E4C\u4E1C\u82D7\u5BE8\u6DF1\u5EA6\u4E00\u65E5\u6E38", mainImage: "https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=\u4E00\u65E5\u6E38", days: 1, includes: ["\u4E09\u9910", "\u5BFC\u6E38", "\u95E8\u7968", "\u94F6\u9970\u4F53\u9A8C"], price: 298 },
      { id: 2, title: "\u82D7\u5BE8+\u68AF\u7530\u5F92\u6B65\u4E24\u65E5\u6E38", mainImage: "https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=\u4E24\u65E5\u6E38", days: 2, nights: 1, includes: ["\u4F4F\u5BBF", "\u4E09\u9910", "\u5F92\u6B65", "\u957F\u684C\u5BB4"], price: 498 }
    ];
    const fallbackGuideList = [
      { id: 1, title: "\u8D35\u9633\u2192\u4E4C\u4E1C\u82D7\u5BE8\u4EA4\u901A\u653B\u7565", departure: "\u8D35\u9633", destination: "\u4E4C\u4E1C", duration: "\u7EA63\u5C0F\u65F6", cost: "\u5927\u5DF4\xA580", description: "\u8D35\u9633\u5BA2\u8F66\u7AD9\u4E58\u5750\u5927\u5DF4\u81F3\u51EF\u91CC\uFF0C\u8F6C\u4E58\u73ED\u8F66\u76F4\u8FBE\u4E4C\u4E1C\u6751\u3002" },
      { id: 2, title: "\u51EF\u91CC\u2192\u4E4C\u4E1C\u82D7\u5BE8\u4EA4\u901A\u653B\u7565", departure: "\u51EF\u91CC", destination: "\u4E4C\u4E1C", duration: "\u7EA61.5\u5C0F\u65F6", cost: "\u5927\u5DF4\xA535", description: "\u51EF\u91CC\u5BA2\u8F66\u7AD9\u51FA\u53D1\uFF0C\u6CBF\u9014\u98CE\u666F\u4F18\u7F8E\uFF0C\u53EF\u6B23\u8D4F\u68AF\u7530\u98CE\u5149\u3002" }
    ];
    const scenicList = ref(fallbackScenicList);
    const routeList = ref(fallbackRouteList);
    const guideList = ref(fallbackGuideList);
    useHead({
      title: "\u666F\u533A\u7EBF\u8DEF - \u4E4C\u4E1C\u6587\u65C5",
      meta: [{ name: "description", content: "\u666F\u533A\u95E8\u7968\u3001\u65C5\u6E38\u8DEF\u7EBF\u5957\u9910\u3001\u4EA4\u901A\u653B\u7565" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "travel-page" }, _attrs))} data-v-a6729311><div class="container page-inner" data-v-a6729311><div class="page-header" data-v-a6729311><h1 data-v-a6729311>\u666F\u533A\u7EBF\u8DEF</h1><p class="page-desc" data-v-a6729311>\u666F\u533A\u95E8\u7968\u3001\u65C5\u6E38\u8DEF\u7EBF\u5957\u9910\u3001\u4EA4\u901A\u653B\u7565</p></div><div class="miao-divider" data-v-a6729311></div><div class="travel-tabs" data-v-a6729311><button class="${ssrRenderClass(["travel-tab", { active: activeTab.value === "scenic" }])}" data-v-a6729311>\u666F\u533A</button><button class="${ssrRenderClass(["travel-tab", { active: activeTab.value === "route" }])}" data-v-a6729311>\u8DEF\u7EBF\u5957\u9910</button><button class="${ssrRenderClass(["travel-tab", { active: activeTab.value === "guide" }])}" data-v-a6729311>\u4EA4\u901A\u653B\u7565</button></div>`);
      if (activeTab.value === "scenic") {
        _push(`<div class="scenic-grid" data-v-a6729311><!--[-->`);
        ssrRenderList(scenicList.value, (item, idx) => {
          _push(`<div class="scenic-card" data-v-a6729311>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/travel",
            class: "scenic-card-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", item.mainImage)}${ssrRenderAttr("alt", item.name)} class="scenic-img" data-v-a6729311${_scopeId}><div class="scenic-body" data-v-a6729311${_scopeId}><h3 class="scenic-name" data-v-a6729311${_scopeId}>${ssrInterpolate(item.name)}</h3><p class="scenic-address" data-v-a6729311${_scopeId}>\u{1F4CD} ${ssrInterpolate(item.address)}</p><div class="scenic-meta" data-v-a6729311${_scopeId}><span class="rating" data-v-a6729311${_scopeId}>\u2B50 ${ssrInterpolate(item.rating)}</span><span class="hours" data-v-a6729311${_scopeId}>\u{1F550} ${ssrInterpolate(item.openHours)}</span></div><p class="scenic-desc" data-v-a6729311${_scopeId}>${ssrInterpolate(item.description)}</p></div>`);
              } else {
                return [
                  createVNode("img", {
                    src: item.mainImage,
                    alt: item.name,
                    class: "scenic-img"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "scenic-body" }, [
                    createVNode("h3", { class: "scenic-name" }, toDisplayString(item.name), 1),
                    createVNode("p", { class: "scenic-address" }, "\u{1F4CD} " + toDisplayString(item.address), 1),
                    createVNode("div", { class: "scenic-meta" }, [
                      createVNode("span", { class: "rating" }, "\u2B50 " + toDisplayString(item.rating), 1),
                      createVNode("span", { class: "hours" }, "\u{1F550} " + toDisplayString(item.openHours), 1)
                    ]),
                    createVNode("p", { class: "scenic-desc" }, toDisplayString(item.description), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "route") {
        _push(`<div class="route-grid" data-v-a6729311><!--[-->`);
        ssrRenderList(routeList.value, (item, idx) => {
          _push(`<div class="route-card" data-v-a6729311>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/travel/route/${item.id}`,
            class: "route-card-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", item.mainImage)}${ssrRenderAttr("alt", item.title)} class="route-img" data-v-a6729311${_scopeId}><div class="route-body" data-v-a6729311${_scopeId}><h3 class="route-title" data-v-a6729311${_scopeId}>${ssrInterpolate(item.title)}</h3><div class="route-days" data-v-a6729311${_scopeId}>\u{1F4C5} ${ssrInterpolate(item.days)}\u5929${ssrInterpolate(item.nights ? item.nights + "\u665A" : "")}</div><div class="route-includes" data-v-a6729311${_scopeId}><!--[-->`);
                ssrRenderList((item.includes || []).slice(0, 4), (inc, i) => {
                  _push2(`<span class="include-tag" data-v-a6729311${_scopeId}>${ssrInterpolate(inc)}</span>`);
                });
                _push2(`<!--]--></div><div class="route-price-row" data-v-a6729311${_scopeId}><span class="price" data-v-a6729311${_scopeId}>\xA5${ssrInterpolate(item.price)}</span><span class="price-unit" data-v-a6729311${_scopeId}>\u8D77/\u4EBA</span></div></div>`);
              } else {
                return [
                  createVNode("img", {
                    src: item.mainImage,
                    alt: item.title,
                    class: "route-img"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "route-body" }, [
                    createVNode("h3", { class: "route-title" }, toDisplayString(item.title), 1),
                    createVNode("div", { class: "route-days" }, "\u{1F4C5} " + toDisplayString(item.days) + "\u5929" + toDisplayString(item.nights ? item.nights + "\u665A" : ""), 1),
                    createVNode("div", { class: "route-includes" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList((item.includes || []).slice(0, 4), (inc, i) => {
                        return openBlock(), createBlock("span", {
                          class: "include-tag",
                          key: i
                        }, toDisplayString(inc), 1);
                      }), 128))
                    ]),
                    createVNode("div", { class: "route-price-row" }, [
                      createVNode("span", { class: "price" }, "\xA5" + toDisplayString(item.price), 1),
                      createVNode("span", { class: "price-unit" }, "\u8D77/\u4EBA")
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "guide") {
        _push(`<div class="guide-list" data-v-a6729311><!--[-->`);
        ssrRenderList(guideList.value, (item, idx) => {
          _push(`<div class="guide-card" data-v-a6729311>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/travel/guide/${item.id}`,
            class: "guide-card-link"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="guide-body" data-v-a6729311${_scopeId}><h3 class="guide-title" data-v-a6729311${_scopeId}>${ssrInterpolate(item.title)}</h3><div class="guide-meta" data-v-a6729311${_scopeId}><span data-v-a6729311${_scopeId}>\u{1F680} ${ssrInterpolate(item.departure)} \u2192 ${ssrInterpolate(item.destination)}</span><span data-v-a6729311${_scopeId}>\u23F1 ${ssrInterpolate(item.duration)}</span><span data-v-a6729311${_scopeId}>\u{1F4B0} ${ssrInterpolate(item.cost)}</span></div><p class="guide-desc" data-v-a6729311${_scopeId}>${ssrInterpolate(item.description)}</p></div>`);
              } else {
                return [
                  createVNode("div", { class: "guide-body" }, [
                    createVNode("h3", { class: "guide-title" }, toDisplayString(item.title), 1),
                    createVNode("div", { class: "guide-meta" }, [
                      createVNode("span", null, "\u{1F680} " + toDisplayString(item.departure) + " \u2192 " + toDisplayString(item.destination), 1),
                      createVNode("span", null, "\u23F1 " + toDisplayString(item.duration), 1),
                      createVNode("span", null, "\u{1F4B0} " + toDisplayString(item.cost), 1)
                    ]),
                    createVNode("p", { class: "guide-desc" }, toDisplayString(item.description), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/travel/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a6729311"]]);

export { index as default };
//# sourceMappingURL=index-DbzN3-L7.mjs.map
