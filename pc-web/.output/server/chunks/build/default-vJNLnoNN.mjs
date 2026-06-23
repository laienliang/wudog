import { defineComponent, mergeProps, ref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
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

const logoSrc$1 = "/logo-wudong.png";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SiteHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const keyword = ref("");
    const isLoggedIn = ref(false);
    const userAvatar = ref("");
    const navItems = [
      { label: "\u8863", path: "/clothing/list" },
      { label: "\u98DF", path: "/food/restaurant" },
      { label: "\u4F4F", path: "/lodging/list" },
      { label: "\u884C", path: "/travel" },
      { label: "\u793E\u533A", path: "/community/feed" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "site-header" }, _attrs))} data-v-dc8708fa><div class="container header-inner" data-v-dc8708fa>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "logo"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="logo-mark" data-v-dc8708fa${_scopeId}><img${ssrRenderAttr("src", logoSrc$1)} alt="\u4E4C\u4E1C\u6587\u65C5" class="logo-img" data-v-dc8708fa${_scopeId}></span><span class="logo-copy" data-v-dc8708fa${_scopeId}><span class="logo-text" data-v-dc8708fa${_scopeId}>\u4E4C\u4E1C\u6587\u65C5</span><span class="logo-subtitle" data-v-dc8708fa${_scopeId}>\u82D7\u5BE8\u751F\u6D3B\u670D\u52A1</span></span>`);
          } else {
            return [
              createVNode("span", { class: "logo-mark" }, [
                createVNode("img", {
                  src: logoSrc$1,
                  alt: "\u4E4C\u4E1C\u6587\u65C5",
                  class: "logo-img"
                })
              ]),
              createVNode("span", { class: "logo-copy" }, [
                createVNode("span", { class: "logo-text" }, "\u4E4C\u4E1C\u6587\u65C5"),
                createVNode("span", { class: "logo-subtitle" }, "\u82D7\u5BE8\u751F\u6D3B\u670D\u52A1")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="main-nav" data-v-dc8708fa><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.path,
          to: item.path,
          class: "nav-link",
          "active-class": "active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="search-box" data-v-dc8708fa><input${ssrRenderAttr("value", keyword.value)} type="text" placeholder="\u641C\u7D22\u5546\u54C1/\u9910\u5385/\u6C11\u5BBF/\u7EBF\u8DEF" class="search-input" data-v-dc8708fa><button class="search-btn" data-v-dc8708fa><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-dc8708fa><circle cx="11" cy="11" r="8" data-v-dc8708fa></circle><path d="m21 21-4.35-4.35" data-v-dc8708fa></path></svg></button></div><div class="user-area" data-v-dc8708fa>`);
      if (isLoggedIn.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/user/profile",
          class: "user-avatar"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", userAvatar.value)} alt="\u5934\u50CF" data-v-dc8708fa${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: userAvatar.value,
                  alt: "\u5934\u50CF"
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/user/login",
          class: "btn btn-outline btn-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u767B\u5F55`);
            } else {
              return [
                createTextVNode("\u767B\u5F55")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/user/login",
          class: "btn btn-primary btn-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u6CE8\u518C`);
            } else {
              return [
                createTextVNode("\u6CE8\u518C")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/SiteHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SiteHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-dc8708fa"]]);
const logoSrc = "/logo-wudong.png";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SiteFooter",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "site-footer" }, _attrs))} data-v-589df673><div class="miao-divider" data-v-589df673></div><div class="container footer-inner" data-v-589df673><div class="footer-cols" data-v-589df673><div class="footer-col" data-v-589df673><div class="footer-brand" data-v-589df673><img${ssrRenderAttr("src", logoSrc)} alt="\u4E4C\u4E1C\u6587\u65C5" data-v-589df673><h4 data-v-589df673>\u4E4C\u4E1C\u6587\u65C5</h4></div><p data-v-589df673>\u4F53\u9A8C\u8D35\u5DDE\u82D7\u65CF\u6587\u5316\uFF0C\u54C1\u5473\u82D7\u5BE8\u98CE\u60C5</p></div><div class="footer-col" data-v-589df673><h4 data-v-589df673>\u4E1A\u52A1\u6A21\u5757</h4><ul data-v-589df673><li data-v-589df673>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/clothing/list" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u975E\u9057\u5546\u54C1`);
          } else {
            return [
              createTextVNode("\u975E\u9057\u5546\u54C1")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-589df673>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/food/restaurant" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u7F8E\u98DF\u9910\u5385`);
          } else {
            return [
              createTextVNode("\u7F8E\u98DF\u9910\u5385")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-589df673>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/lodging/list" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u7279\u8272\u6C11\u5BBF`);
          } else {
            return [
              createTextVNode("\u7279\u8272\u6C11\u5BBF")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-589df673>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/travel" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u666F\u533A\u7EBF\u8DEF`);
          } else {
            return [
              createTextVNode("\u666F\u533A\u7EBF\u8DEF")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="footer-col" data-v-589df673><h4 data-v-589df673>\u5E2E\u52A9\u4E2D\u5FC3</h4><ul data-v-589df673><li data-v-589df673><a href="#" data-v-589df673>\u9884\u8BA2\u8BF4\u660E</a></li><li data-v-589df673><a href="#" data-v-589df673>\u9000\u6B3E\u653F\u7B56</a></li><li data-v-589df673><a href="#" data-v-589df673>\u5E38\u89C1\u95EE\u9898</a></li></ul></div><div class="footer-col" data-v-589df673><h4 data-v-589df673>\u8054\u7CFB\u6211\u4EEC</h4><ul data-v-589df673><li data-v-589df673>\u7535\u8BDD\uFF1A400-XXX-XXXX</li><li data-v-589df673>\u5730\u5740\uFF1A\u8D35\u5DDE\u7701\u9ED4\u4E1C\u5357\u5DDE</li></ul></div></div><div class="footer-bottom" data-v-589df673><p data-v-589df673>\xA9 2026 \u4E4C\u4E1C\u6587\u65C5 &quot;\u8863\u98DF\u4F4F\u884C&quot;\u7EFC\u5408\u670D\u52A1\u5E73\u53F0 \xB7 \u4EC5\u4F9B\u6559\u5B66\u6F14\u793A</p></div></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/SiteFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SiteFooter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-589df673"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "default-layout" }, _attrs))} data-v-53bdd3ed>`);
      _push(ssrRenderComponent(SiteHeader, null, null, _parent));
      _push(`<main class="main-content" data-v-53bdd3ed>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(SiteFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-53bdd3ed"]]);

export { _default as default };
//# sourceMappingURL=default-vJNLnoNN.mjs.map
