import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "publish",
  __ssrInlineRender: true,
  setup(__props) {
    const title = ref("");
    const cover = ref("");
    const content = ref("");
    useHead({ title: "\u53D1\u5E03\u6E38\u8BB0 - \u4E4C\u4E1C\u6587\u65C5" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "publish-page" }, _attrs))} data-v-5e4d2fea><div class="container" data-v-5e4d2fea>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/community/feed",
        class: "back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u8FD4\u56DE\u6E38\u8BB0\u793E\u533A`);
          } else {
            return [
              createTextVNode("\u2190 \u8FD4\u56DE\u6E38\u8BB0\u793E\u533A")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="publish-card" data-v-5e4d2fea><div class="publish-head" data-v-5e4d2fea><span class="eyebrow" data-v-5e4d2fea>\u53D1\u5E03\u6E38\u8BB0</span><h1 data-v-5e4d2fea>\u8BB0\u5F55\u4F60\u7684\u4E4C\u4E1C\u4E4B\u65C5</h1><p data-v-5e4d2fea>\u5206\u4EAB\u98CE\u666F\u3001\u7F8E\u98DF\u3001\u6C11\u5BBF\u548C\u975E\u9057\u4F53\u9A8C\uFF0C\u8BA9\u66F4\u591A\u4EBA\u770B\u89C1\u82D7\u5BE8\u751F\u6D3B\u3002</p></div><div class="form-grid" data-v-5e4d2fea><input${ssrRenderAttr("value", unref(title))} type="text" placeholder="\u6E38\u8BB0\u6807\u9898" data-v-5e4d2fea><input${ssrRenderAttr("value", unref(cover))} type="text" placeholder="\u5C01\u9762\u56FE\u7247\u5730\u5740" data-v-5e4d2fea><textarea placeholder="\u5199\u4E0B\u4F60\u7684\u65C5\u884C\u6545\u4E8B" data-v-5e4d2fea>${ssrInterpolate(unref(content))}</textarea><button class="btn btn-primary" type="button" data-v-5e4d2fea>\u53D1\u5E03</button></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/community/publish.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const publish = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5e4d2fea"]]);

export { publish as default };
//# sourceMappingURL=publish-C-lKapIP.mjs.map
