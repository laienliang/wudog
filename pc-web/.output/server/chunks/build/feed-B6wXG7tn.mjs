import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "feed",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("recommend");
    const articles = ref([
      { title: "\u4E4C\u4E1C\u82D7\u5BE8\u7684\u6E05\u6668\uFF0C\u4E91\u96FE\u4E2D\u7684\u540A\u811A\u697C", cover: "https://via.placeholder.com/600x800/F7F8FA/1F5FA8?text=\u82D7\u5BE8\u6E05\u6668", author: "\u65C5\u884C\u8005\u5C0F\u738B", authorAvatar: "https://via.placeholder.com/40x40/E8F1FB/1F5FA8?text=W", likes: 128, comments: 36 },
      { title: "\u7B2C\u4E00\u6B21\u6765\u4E4C\u4E1C\uFF0C\u5C31\u88AB\u957F\u684C\u5BB4\u9707\u64BC\u4E86", cover: "https://via.placeholder.com/600x400/F7F8FA/E85D2F?text=\u957F\u684C\u5BB4", author: "\u7F8E\u98DF\u8FBE\u4EBA", authorAvatar: "https://via.placeholder.com/40x40/FFF1EA/E85D2F?text=M", likes: 256, comments: 82 },
      { title: "\u4E4C\u4E1C\u68AF\u7530\uFF0C\u79CB\u5929\u7684\u91D1\u8272\u753B\u5377", cover: "https://via.placeholder.com/600x600/F7F8FA/6B8E3D?text=\u68AF\u7530", author: "\u6444\u5F71\u5E08\u8001\u674E", authorAvatar: "https://via.placeholder.com/40x40/F6FFED/6B8E3D?text=L", likes: 342, comments: 48 },
      { title: "\u4EB2\u624B\u6253\u4E86\u4E00\u53EA\u94F6\u956F\u5B50\u2014\u2014\u4E4C\u4E1C\u94F6\u9970\u4F53\u9A8C", cover: "https://via.placeholder.com/600x500/F7F8FA/D4A14B?text=\u94F6\u9970", author: "\u624B\u5DE5\u827A\u7231\u597D\u8005", authorAvatar: "https://via.placeholder.com/40x40/FFF7E6/D4A14B?text=H", likes: 189, comments: 55 },
      { title: "\u82D7\u5E74\u8282\u7684\u7BDD\u706B\u665A\u4F1A\uFF0C\u592A\u71C3\u4E86", cover: "https://via.placeholder.com/600x700/F7F8FA/E85D2F?text=\u82D7\u5E74", author: "\u6587\u5316\u63A2\u7D22\u8005", authorAvatar: "https://via.placeholder.com/40x40/E8F1FB/1F5FA8?text=C", likes: 420, comments: 96 },
      { title: "\u82D7\u5BE8\u6C11\u5BBF\u63A8\u8350\uFF5C\u540A\u811A\u697C\u91CC\u7684\u661F\u7A7A\u4E4B\u591C", cover: "https://via.placeholder.com/600x450/F7F8FA/6B8E3D?text=\u6C11\u5BBF", author: "\u6C11\u5BBF\u63A7", authorAvatar: "https://via.placeholder.com/40x40/F6FFED/6B8E3D?text=R", likes: 156, comments: 42 }
    ]);
    useHead({
      title: "\u6E38\u8BB0\u793E\u533A - \u4E4C\u4E1C\u6587\u65C5",
      meta: [{ name: "description", content: "\u5206\u4EAB\u4F60\u7684\u4E4C\u4E1C\u4E4B\u65C5\uFF0C\u8BB0\u5F55\u82D7\u5BE8\u7684\u7F8E\u597D\u65F6\u5149" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "community-feed-page" }, _attrs))} data-v-53e00cb0><div class="container page-inner" data-v-53e00cb0><div class="page-header" data-v-53e00cb0><h1 data-v-53e00cb0>\u6E38\u8BB0\u793E\u533A</h1><p class="page-desc" data-v-53e00cb0>\u5206\u4EAB\u4F60\u7684\u4E4C\u4E1C\u4E4B\u65C5</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/community/publish",
        class: "btn btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u53D1\u5E03\u6E38\u8BB0`);
          } else {
            return [
              createTextVNode("\u53D1\u5E03\u6E38\u8BB0")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="miao-divider" data-v-53e00cb0></div><div class="feed-tabs" data-v-53e00cb0><button class="${ssrRenderClass(["feed-tab", { active: activeTab.value === "recommend" }])}" data-v-53e00cb0>\u63A8\u8350</button><button class="${ssrRenderClass(["feed-tab", { active: activeTab.value === "latest" }])}" data-v-53e00cb0>\u6700\u65B0</button><button class="${ssrRenderClass(["feed-tab", { active: activeTab.value === "hot" }])}" data-v-53e00cb0>\u6700\u70ED</button></div><div class="masonry-grid" data-v-53e00cb0><!--[-->`);
      ssrRenderList(articles.value, (art, idx) => {
        _push(`<div class="masonry-item" data-v-53e00cb0>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/community/article/1",
          class: "masonry-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", art.cover)}${ssrRenderAttr("alt", art.title)} class="masonry-img" data-v-53e00cb0${_scopeId}><div class="masonry-body" data-v-53e00cb0${_scopeId}><h3 class="masonry-title" data-v-53e00cb0${_scopeId}>${ssrInterpolate(art.title)}</h3><div class="masonry-footer" data-v-53e00cb0${_scopeId}><img${ssrRenderAttr("src", art.authorAvatar)} alt="" class="author-avatar" data-v-53e00cb0${_scopeId}><span class="author-name" data-v-53e00cb0${_scopeId}>${ssrInterpolate(art.author)}</span><span class="masonry-stats" data-v-53e00cb0${_scopeId}>\u2764 ${ssrInterpolate(art.likes)} \xB7 \u{1F4AC} ${ssrInterpolate(art.comments)}</span></div></div>`);
            } else {
              return [
                createVNode("img", {
                  src: art.cover,
                  alt: art.title,
                  class: "masonry-img"
                }, null, 8, ["src", "alt"]),
                createVNode("div", { class: "masonry-body" }, [
                  createVNode("h3", { class: "masonry-title" }, toDisplayString(art.title), 1),
                  createVNode("div", { class: "masonry-footer" }, [
                    createVNode("img", {
                      src: art.authorAvatar,
                      alt: "",
                      class: "author-avatar"
                    }, null, 8, ["src"]),
                    createVNode("span", { class: "author-name" }, toDisplayString(art.author), 1),
                    createVNode("span", { class: "masonry-stats" }, "\u2764 " + toDisplayString(art.likes) + " \xB7 \u{1F4AC} " + toDisplayString(art.comments), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/community/feed.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const feed = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-53e00cb0"]]);

export { feed as default };
//# sourceMappingURL=feed-B6wXG7tn.mjs.map
