import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const entries = [
      { title: "\u6211\u7684\u8D2D\u7269\u8F66", desc: "\u67E5\u770B\u5F85\u7ED3\u7B97\u5546\u54C1", path: "/cart" },
      { title: "\u6211\u7684\u6536\u85CF", desc: "\u5546\u54C1\u3001\u6C11\u5BBF\u548C\u7EBF\u8DEF", path: "/clothing/list" },
      { title: "\u6211\u7684\u6E38\u8BB0", desc: "\u67E5\u770B\u5DF2\u53D1\u5E03\u5185\u5BB9", path: "/community/feed" },
      { title: "\u51FA\u884C\u8BA1\u5212", desc: "\u67E5\u770B\u65C5\u6E38\u8DEF\u7EBF", path: "/travel" }
    ];
    useHead({ title: "\u4E2A\u4EBA\u4E2D\u5FC3 - \u4E4C\u4E1C\u6587\u65C5" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-page" }, _attrs))} data-v-f856166e><div class="container" data-v-f856166e><section class="profile-hero" data-v-f856166e><img src="https://via.placeholder.com/96x96/E8F1FB/1F5FA8?text=U" alt="\u7528\u6237\u5934\u50CF" data-v-f856166e><div data-v-f856166e><span class="eyebrow" data-v-f856166e>\u4E2A\u4EBA\u4E2D\u5FC3</span><h1 data-v-f856166e>\u4E4C\u4E1C\u6E38\u5BA2</h1><p data-v-f856166e>\u7BA1\u7406\u8BA2\u5355\u3001\u6536\u85CF\u3001\u6E38\u8BB0\u548C\u51FA\u884C\u8BA1\u5212\u3002</p></div></section><section class="profile-grid" data-v-f856166e><!--[-->`);
      ssrRenderList(entries, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.title,
          to: item.path,
          class: "profile-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<strong data-v-f856166e${_scopeId}>${ssrInterpolate(item.title)}</strong><span data-v-f856166e${_scopeId}>${ssrInterpolate(item.desc)}</span>`);
            } else {
              return [
                createVNode("strong", null, toDisplayString(item.title), 1),
                createVNode("span", null, toDisplayString(item.desc), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f856166e"]]);

export { profile as default };
//# sourceMappingURL=profile-DVO_qORe.mjs.map
