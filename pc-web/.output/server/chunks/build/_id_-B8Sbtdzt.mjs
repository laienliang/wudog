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
    useRoute();
    useClientApi();
    const article = ref({
      title: "\u4E4C\u4E1C\u82D7\u5BE8\u7684\u6E05\u6668\uFF0C\u4E91\u96FE\u4E2D\u7684\u540A\u811A\u697C",
      cover: "https://via.placeholder.com/1000x560/F7F8FA/1F5FA8?text=\u82D7\u5BE8\u6E05\u6668",
      author: "\u65C5\u884C\u8005\u5C0F\u738B",
      authorAvatar: "https://via.placeholder.com/48x48/E8F1FB/1F5FA8?text=W",
      likes: 128,
      comments: 36,
      content: [
        "\u6E05\u6668\u516D\u70B9\u7684\u4E4C\u4E1C\u6751\u8FD8\u85CF\u5728\u4E91\u96FE\u91CC\uFF0C\u540A\u811A\u697C\u7684\u6728\u6A90\u4ECE\u96FE\u6C14\u4E2D\u6162\u6162\u663E\u51FA\u6765\uFF0C\u50CF\u4E00\u5E45\u6B63\u5728\u5C55\u5F00\u7684\u5C71\u6C34\u957F\u5377\u3002",
        "\u6CBF\u7740\u77F3\u677F\u8DEF\u5F80\u68AF\u7530\u65B9\u5411\u8D70\uFF0C\u80FD\u542C\u89C1\u8FDC\u5904\u9E21\u9E23\u548C\u6EAA\u6C34\u58F0\u3002\u5F53\u5730\u963F\u59E8\u5DF2\u7ECF\u5F00\u59CB\u51C6\u5907\u7CEF\u7C73\u996D\uFF0C\u7A7A\u6C14\u91CC\u6709\u6728\u67F4\u548C\u7C73\u9999\u3002",
        "\u6700\u559C\u6B22\u7684\u662F\u94F6\u9970\u5DE5\u574A\uFF0C\u8001\u5E08\u5085\u4E00\u8FB9\u6572\u6253\u94F6\u7247\uFF0C\u4E00\u8FB9\u8BB2\u7EB9\u6837\u91CC\u7684\u8774\u8776\u3001\u8C37\u7A57\u548C\u5C71\u8DEF\u3002\u90A3\u4E00\u523B\uFF0C\u975E\u9057\u4E0D\u518D\u53EA\u662F\u5C55\u67DC\u91CC\u7684\u4F5C\u54C1\uFF0C\u800C\u662F\u8FD8\u5728\u751F\u6D3B\u91CC\u53D1\u5149\u7684\u624B\u827A\u3002"
      ]
    });
    useHead({
      title: `${article.value.title} - \u4E4C\u4E1C\u6587\u65C5`
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "article-page" }, _attrs))} data-v-ceb09763><div class="container" data-v-ceb09763>`);
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
      _push(`<article class="article-card" data-v-ceb09763><img${ssrRenderAttr("src", unref(article).cover)}${ssrRenderAttr("alt", unref(article).title)} class="article-cover" data-v-ceb09763><div class="article-body" data-v-ceb09763><span class="eyebrow" data-v-ceb09763>\u7CBE\u9009\u6E38\u8BB0</span><h1 data-v-ceb09763>${ssrInterpolate(unref(article).title)}</h1><div class="author-row" data-v-ceb09763><img${ssrRenderAttr("src", unref(article).authorAvatar)} alt="" data-v-ceb09763><span data-v-ceb09763>${ssrInterpolate(unref(article).author)}</span><span data-v-ceb09763>${ssrInterpolate(unref(article).likes)} \u8D5E \xB7 ${ssrInterpolate(unref(article).comments)} \u8BC4\u8BBA</span></div><!--[-->`);
      ssrRenderList(unref(article).content, (paragraph) => {
        _push(`<p data-v-ceb09763>${ssrInterpolate(paragraph)}</p>`);
      });
      _push(`<!--]--></div></article></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/community/article/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ceb09763"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-B8Sbtdzt.mjs.map
