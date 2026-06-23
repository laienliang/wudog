import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { ElPagination } from 'element-plus/es';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
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

const pageSize = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "list",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = [
      { id: 0, name: "\u5168\u90E8" },
      { id: 1, name: "\u94F6\u9970" },
      { id: 2, name: "\u8721\u67D3" },
      { id: 3, name: "\u523A\u7EE3" },
      { id: 4, name: "\u670D\u9970" }
    ];
    const sortOptions = [
      { label: "\u7EFC\u5408", value: "default" },
      { label: "\u9500\u91CF", value: "sales" },
      { label: "\u4EF7\u683C \u2191", value: "price_asc" },
      { label: "\u4EF7\u683C \u2193", value: "price_desc" }
    ];
    const activeCategory = ref(0);
    const activeSort = ref("default");
    const currentPage = ref(1);
    const total = ref(48);
    const goodsList = ref([
      { id: 1, title: "\u82D7\u65CF\u94F6\u9970\u624B\u956F", subtitle: "\u624B\u5DE5\u953B\u9020\uFF0C\u4F20\u627F\u767E\u5E74\u5DE5\u827A", price: 368, mainImage: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u94F6\u9970\u624B\u956F", sales: 128 },
      { id: 2, title: "\u8721\u67D3\u5E03\u827A\u6302\u753B", subtitle: "\u5929\u7136\u690D\u7269\u67D3\u6599\uFF0C\u7EAF\u624B\u5DE5\u5236\u4F5C", price: 198, mainImage: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u8721\u67D3\u6302\u753B", sales: 86 },
      { id: 3, title: "\u82D7\u65CF\u523A\u7EE3\u9999\u5305", subtitle: "\u7CBE\u7F8E\u523A\u7EE3\uFF0C\u5929\u7136\u9999\u6599\u586B\u5145", price: 68, mainImage: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u523A\u7EE3\u9999\u5305", sales: 256 },
      { id: 4, title: "\u82D7\u670D\u65E5\u5E38\u6B3E", subtitle: "\u4F20\u7EDF\u7EB9\u6837\uFF0C\u73B0\u4EE3\u526A\u88C1", price: 588, mainImage: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u82D7\u670D", sales: 42 },
      { id: 5, title: "\u94F6\u5934\u9970\u5957\u88C5", subtitle: "\u65B0\u5A18\u5FC5\u5907\uFF0C\u7CBE\u5DE5\u7EC6\u4F5C", price: 1280, mainImage: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u5934\u9970", sales: 18 },
      { id: 6, title: "\u8721\u67D3\u56F4\u5DFE", subtitle: "\u4FBF\u643A\u5B9E\u7528\uFF0C\u9001\u793C\u4F73\u54C1", price: 128, mainImage: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u56F4\u5DFE", sales: 312 }
    ]);
    useHead({
      title: "\u975E\u9057\u5546\u54C1 - \u4E4C\u4E1C\u6587\u65C5",
      meta: [{ name: "description", content: "\u82D7\u65CF\u94F6\u9970\u3001\u8721\u67D3\u3001\u523A\u7EE3\u7B49\u4F20\u7EDF\u624B\u5DE5\u827A\u54C1\u5728\u7EBF\u9009\u8D2D" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_el_pagination = ElPagination;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "clothing-page" }, _attrs))} data-v-5d67df87><div class="container page-inner" data-v-5d67df87><div class="page-header" data-v-5d67df87><h1 data-v-5d67df87>\u975E\u9057\u5546\u54C1</h1><p class="page-desc" data-v-5d67df87>\u82D7\u65CF\u94F6\u9970\u3001\u8721\u67D3\u3001\u523A\u7EE3\u7B49\u4F20\u7EDF\u624B\u5DE5\u827A\u54C1</p></div><div class="miao-divider" data-v-5d67df87></div><div class="filter-bar" data-v-5d67df87><div class="filter-group" data-v-5d67df87><span class="filter-label" data-v-5d67df87>\u5206\u7C7B\uFF1A</span><!--[-->`);
      ssrRenderList(categories, (cat) => {
        _push(`<button class="${ssrRenderClass(["filter-btn", { active: unref(activeCategory) === cat.id }])}" data-v-5d67df87>${ssrInterpolate(cat.name)}</button>`);
      });
      _push(`<!--]--></div><div class="filter-group" data-v-5d67df87><span class="filter-label" data-v-5d67df87>\u6392\u5E8F\uFF1A</span><!--[-->`);
      ssrRenderList(sortOptions, (opt) => {
        _push(`<button class="${ssrRenderClass(["filter-btn", { active: unref(activeSort) === opt.value }])}" data-v-5d67df87>${ssrInterpolate(opt.label)}</button>`);
      });
      _push(`<!--]--></div></div><div class="goods-grid" data-v-5d67df87><!--[-->`);
      ssrRenderList(unref(goodsList), (item, idx) => {
        _push(`<div class="goods-card-item" data-v-5d67df87>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/clothing/detail/${item.id}`,
          class: "goods-card-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", item.mainImage)}${ssrRenderAttr("alt", item.title)} class="goods-img" data-v-5d67df87${_scopeId}><div class="goods-body" data-v-5d67df87${_scopeId}><h3 class="goods-title" data-v-5d67df87${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="goods-subtitle" data-v-5d67df87${_scopeId}>${ssrInterpolate(item.subtitle)}</p><div class="goods-footer" data-v-5d67df87${_scopeId}><span class="price" data-v-5d67df87${_scopeId}>\xA5${ssrInterpolate(item.price)}</span><span class="goods-sales" data-v-5d67df87${_scopeId}>\u5DF2\u552E ${ssrInterpolate(item.sales)}</span></div></div>`);
            } else {
              return [
                createVNode("img", {
                  src: item.mainImage,
                  alt: item.title,
                  class: "goods-img"
                }, null, 8, ["src", "alt"]),
                createVNode("div", { class: "goods-body" }, [
                  createVNode("h3", { class: "goods-title" }, toDisplayString(item.title), 1),
                  createVNode("p", { class: "goods-subtitle" }, toDisplayString(item.subtitle), 1),
                  createVNode("div", { class: "goods-footer" }, [
                    createVNode("span", { class: "price" }, "\xA5" + toDisplayString(item.price), 1),
                    createVNode("span", { class: "goods-sales" }, "\u5DF2\u552E " + toDisplayString(item.sales), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="pagination-wrapper" data-v-5d67df87>`);
      _push(ssrRenderComponent(_component_el_pagination, {
        "current-page": unref(currentPage),
        "onUpdate:currentPage": ($event) => isRef(currentPage) ? currentPage.value = $event : null,
        "page-size": pageSize,
        total: unref(total),
        layout: "prev, pager, next, jumper"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/clothing/list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const list = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5d67df87"]]);

export { list as default };
//# sourceMappingURL=list-DxoVwU0E.mjs.map
