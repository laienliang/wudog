import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("phone");
    const phone = ref("");
    const code = ref("");
    const countdown = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-534f49e4><div class="login-container" data-v-534f49e4><div class="login-header" data-v-534f49e4><h1 data-v-534f49e4>\u4E4C\u4E1C\u6587\u65C5</h1><p data-v-534f49e4>\u767B\u5F55/\u6CE8\u518C\uFF0C\u5F00\u542F\u4F60\u7684\u82D7\u5BE8\u4E4B\u65C5</p></div><div class="login-form" data-v-534f49e4><div class="form-tabs" data-v-534f49e4><button class="${ssrRenderClass(["form-tab", { active: activeTab.value === "phone" }])}" data-v-534f49e4>\u624B\u673A\u53F7\u767B\u5F55</button><button class="${ssrRenderClass(["form-tab", { active: activeTab.value === "wechat" }])}" data-v-534f49e4>\u5FAE\u4FE1\u767B\u5F55</button></div>`);
      if (activeTab.value === "phone") {
        _push(`<!--[--><div class="form-group" data-v-534f49e4><input${ssrRenderAttr("value", phone.value)} type="tel" placeholder="\u8BF7\u8F93\u5165\u624B\u673A\u53F7" class="form-input" maxlength="11" data-v-534f49e4></div><div class="form-group" data-v-534f49e4><div class="code-row" data-v-534f49e4><input${ssrRenderAttr("value", code.value)} type="text" placeholder="\u9A8C\u8BC1\u7801" class="form-input" maxlength="6" data-v-534f49e4><button class="code-btn"${ssrIncludeBooleanAttr(countdown.value > 0) ? " disabled" : ""} data-v-534f49e4>${ssrInterpolate(countdown.value > 0 ? `${countdown.value}s` : "\u83B7\u53D6\u9A8C\u8BC1\u7801")}</button></div></div><button class="login-btn" data-v-534f49e4>\u767B\u5F55 / \u6CE8\u518C</button><p class="form-tip" data-v-534f49e4>\u767B\u5F55\u5373\u8868\u793A\u540C\u610F\u300A\u7528\u6237\u534F\u8BAE\u300B\u548C\u300A\u9690\u79C1\u653F\u7B56\u300B</p><!--]-->`);
      } else {
        _push(`<div class="wechat-login" data-v-534f49e4><div class="qr-placeholder" data-v-534f49e4><p data-v-534f49e4>\u6253\u5F00\u5FAE\u4FE1\u626B\u4E00\u626B</p><img src="https://via.placeholder.com/200x200/F7F8FA/1F5FA8?text=QR+Code" alt="\u5FAE\u4FE1\u767B\u5F55\u4E8C\u7EF4\u7801" class="qr-img" data-v-534f49e4></div></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-534f49e4"]]);

export { login as default };
//# sourceMappingURL=login-DLrI0Jex.mjs.map
