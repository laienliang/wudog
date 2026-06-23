import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
    const guides = [
      {
        id: 1,
        title: "\u8D35\u9633\u2192\u4E4C\u4E1C\u82D7\u5BE8\u4EA4\u901A\u653B\u7565",
        departure: "\u8D35\u9633",
        destination: "\u4E4C\u4E1C",
        duration: "\u7EA63\u5C0F\u65F6",
        cost: "\u5927\u5DF4\xA580",
        description: "\u9002\u5408\u4ECE\u8D35\u9633\u51FA\u53D1\u7684\u6E38\u5BA2\uFF0C\u63A8\u8350\u5BA2\u8F66\u548C\u5305\u8F66\u4E24\u79CD\u65B9\u5F0F\u3002",
        steps: [
          { title: "\u7B2C\u4E00\u6BB5\uFF1A\u8D35\u9633\u5230\u51EF\u91CC", content: "\u4ECE\u8D35\u9633\u5BA2\u8F66\u7AD9\u4E58\u5750\u524D\u5F80\u51EF\u91CC\u7684\u5927\u5DF4\uFF0C\u7EA62\u5C0F\u65F6\u3002" },
          { title: "\u7B2C\u4E8C\u6BB5\uFF1A\u51EF\u91CC\u5230\u4E4C\u4E1C", content: "\u5728\u51EF\u91CC\u5BA2\u8F66\u7AD9\u8F6C\u4E58\u4E61\u9547\u73ED\u8F66\uFF0C\u7EA61\u5C0F\u65F6\u62B5\u8FBE\u4E4C\u4E1C\u6751\u53E3\u3002" },
          { title: "\u5230\u8FBE\u63D0\u793A", content: "\u5EFA\u8BAE\u63D0\u524D\u8054\u7CFB\u6C11\u5BBF\u6216\u5546\u5BB6\u786E\u8BA4\u63A5\u9A73\u4F4D\u7F6E\u3002" }
        ]
      },
      {
        id: 2,
        title: "\u51EF\u91CC\u2192\u4E4C\u4E1C\u82D7\u5BE8\u4EA4\u901A\u653B\u7565",
        departure: "\u51EF\u91CC",
        destination: "\u4E4C\u4E1C",
        duration: "\u7EA61.5\u5C0F\u65F6",
        cost: "\u5927\u5DF4\xA535",
        description: "\u51EF\u91CC\u51FA\u53D1\u66F4\u9002\u5408\u5468\u8FB9\u77ED\u9014\u6E38\uFF0C\u6CBF\u9014\u53EF\u6B23\u8D4F\u5C71\u5730\u4E0E\u68AF\u7530\u98CE\u5149\u3002",
        steps: [
          { title: "\u5BA2\u8F66\u8DEF\u7EBF", content: "\u51EF\u91CC\u5BA2\u8F66\u7AD9\u4E58\u5750\u4E4C\u4E1C\u65B9\u5411\u73ED\u8F66\uFF0C\u5230\u6751\u53E3\u4E0B\u8F66\u3002" },
          { title: "\u81EA\u9A7E\u8DEF\u7EBF", content: "\u5BFC\u822A\u81F3\u4E4C\u4E1C\u6751\u6E38\u5BA2\u670D\u52A1\u70B9\uFF0C\u6751\u5185\u9053\u8DEF\u8F83\u7A84\uFF0C\u6CE8\u610F\u4F1A\u8F66\u3002" }
        ]
      }
    ];
    const guide = computed(() => guides.find((item) => item.id === Number(route.params.id)) || guides[0]);
    useHead(() => ({ title: `${guide.value.title} - \u4E4C\u4E1C\u6587\u65C5` }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "guide-page" }, _attrs))} data-v-e2722b76><div class="container" data-v-e2722b76>`);
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
      _push(`<article class="guide-article" data-v-e2722b76><span class="eyebrow" data-v-e2722b76>\u4EA4\u901A\u653B\u7565</span><h1 data-v-e2722b76>${ssrInterpolate(unref(guide).title)}</h1><div class="guide-meta" data-v-e2722b76><span data-v-e2722b76>\u{1F680} ${ssrInterpolate(unref(guide).departure)} \u2192 ${ssrInterpolate(unref(guide).destination)}</span><span data-v-e2722b76>\u23F1 ${ssrInterpolate(unref(guide).duration)}</span><span data-v-e2722b76>\u{1F4B0} ${ssrInterpolate(unref(guide).cost)}</span></div><p class="lead" data-v-e2722b76>${ssrInterpolate(unref(guide).description)}</p><div class="step-list" data-v-e2722b76><!--[-->`);
      ssrRenderList(unref(guide).steps, (step) => {
        _push(`<div class="step-item" data-v-e2722b76><strong data-v-e2722b76>${ssrInterpolate(step.title)}</strong><p data-v-e2722b76>${ssrInterpolate(step.content)}</p></div>`);
      });
      _push(`<!--]--></div></article></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/travel/guide/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e2722b76"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CEnvV87_.mjs.map
