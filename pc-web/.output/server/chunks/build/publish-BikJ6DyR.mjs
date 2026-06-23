import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { ElUpload } from 'element-plus/es';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ElMessage } from 'element-plus';
import { _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';
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
  __name: "publish",
  __ssrInlineRender: true,
  setup(__props) {
    const title = ref("");
    const cover = ref("");
    const content = ref("");
    const uploading = ref(false);
    const config = useRuntimeConfig();
    const uploadUrl = computed(() => {
      const clientBase = config.public.apiBase || "http://localhost:8001/open/client";
      return clientBase.replace(/\/open\/client\/?$/, "/app/base/comm/upload");
    });
    function beforeCoverUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        ElMessage.warning("\u8BF7\u9009\u62E9\u56FE\u7247\u6587\u4EF6");
        return false;
      }
      if (!isLt5M) {
        ElMessage.warning("\u56FE\u7247\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 5MB");
        return false;
      }
      return true;
    }
    async function uploadCover(options) {
      var _a, _b;
      const formData = new FormData();
      formData.append("file", options.file);
      uploading.value = true;
      try {
        const res = await $fetch(uploadUrl.value, {
          method: "POST",
          body: formData
        });
        if ((res.code === 1e3 || res.code === 0 || res.code === void 0) && res.data) {
          cover.value = res.data;
          (_a = options.onSuccess) == null ? void 0 : _a.call(options, res);
          ElMessage.success("\u5C01\u9762\u4E0A\u4F20\u6210\u529F");
          return;
        }
        throw new Error(res.message || "\u4E0A\u4F20\u5931\u8D25");
      } catch (err) {
        const message = err instanceof Error ? err.message : "\u4E0A\u4F20\u5931\u8D25";
        (_b = options.onError) == null ? void 0 : _b.call(options, err);
        ElMessage.error(message);
      } finally {
        uploading.value = false;
      }
    }
    useHead({ title: "\u53D1\u5E03\u6E38\u8BB0 - \u4E4C\u4E1C\u6587\u65C5" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_el_upload = ElUpload;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "publish-page" }, _attrs))} data-v-69577a77><div class="container" data-v-69577a77>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/community/feed",
        class: "back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u8FD4\u56DE\u6E38\u8BB0\u793E\u533A`);
          } else {
            return [
              createTextVNode("\u8FD4\u56DE\u6E38\u8BB0\u793E\u533A")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="publish-card" data-v-69577a77><div class="publish-head" data-v-69577a77><span class="eyebrow" data-v-69577a77>\u53D1\u5E03\u6E38\u8BB0</span><h1 data-v-69577a77>\u8BB0\u5F55\u4F60\u7684\u4E4C\u4E1C\u4E4B\u65C5</h1><p data-v-69577a77>\u5206\u4EAB\u98CE\u666F\u3001\u7F8E\u98DF\u3001\u6C11\u5BBF\u548C\u975E\u9057\u4F53\u9A8C\uFF0C\u8BA9\u66F4\u591A\u4EBA\u770B\u89C1\u82D7\u5BE8\u751F\u6D3B\u3002</p></div><div class="form-grid" data-v-69577a77><label class="field field-title" data-v-69577a77><span data-v-69577a77>\u6E38\u8BB0\u6807\u9898</span><input${ssrRenderAttr("value", unref(title))} type="text" placeholder="\u4F8B\u5982\uFF1A\u4E4C\u4E1C\u82D7\u5BE8\u7684\u6E05\u6668" data-v-69577a77></label><div class="field" data-v-69577a77><span data-v-69577a77>\u5C01\u9762\u56FE\u7247</span>`);
      _push(ssrRenderComponent(_component_el_upload, {
        class: "cover-upload",
        accept: "image/*",
        "show-file-list": false,
        "http-request": uploadCover,
        "before-upload": beforeCoverUpload,
        disabled: unref(uploading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([{ "is-uploading": unref(uploading), "has-cover": !!unref(cover) }, "cover-uploader"])}" data-v-69577a77${_scopeId}>`);
            if (unref(cover)) {
              _push2(`<img class="cover-preview"${ssrRenderAttr("src", unref(cover))} alt="\u6E38\u8BB0\u5C01\u9762" data-v-69577a77${_scopeId}>`);
            } else {
              _push2(`<div class="cover-placeholder" data-v-69577a77${_scopeId}><span class="upload-mark" data-v-69577a77${_scopeId}>+</span><strong data-v-69577a77${_scopeId}>${ssrInterpolate(unref(uploading) ? "\u4E0A\u4F20\u4E2D" : "\u4E0A\u4F20\u5C01\u9762")}</strong><small data-v-69577a77${_scopeId}>JPG / PNG / WebP\uFF0C\u5EFA\u8BAE\u6A2A\u56FE</small></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: ["cover-uploader", { "is-uploading": unref(uploading), "has-cover": !!unref(cover) }]
              }, [
                unref(cover) ? (openBlock(), createBlock("img", {
                  key: 0,
                  class: "cover-preview",
                  src: unref(cover),
                  alt: "\u6E38\u8BB0\u5C01\u9762"
                }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "cover-placeholder"
                }, [
                  createVNode("span", { class: "upload-mark" }, "+"),
                  createVNode("strong", null, toDisplayString(unref(uploading) ? "\u4E0A\u4F20\u4E2D" : "\u4E0A\u4F20\u5C01\u9762"), 1),
                  createVNode("small", null, "JPG / PNG / WebP\uFF0C\u5EFA\u8BAE\u6A2A\u56FE")
                ]))
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(cover)) {
        _push(`<div class="cover-actions" data-v-69577a77><span class="cover-url" data-v-69577a77>${ssrInterpolate(unref(cover))}</span><button type="button" class="text-btn" data-v-69577a77>\u79FB\u9664</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><label class="field" data-v-69577a77><span data-v-69577a77>\u65C5\u884C\u6545\u4E8B</span><textarea placeholder="\u5199\u4E0B\u4F60\u7684\u65C5\u884C\u6545\u4E8B" data-v-69577a77>${ssrInterpolate(unref(content))}</textarea></label><button class="btn btn-primary" type="button"${ssrIncludeBooleanAttr(unref(uploading)) ? " disabled" : ""} data-v-69577a77>\u53D1\u5E03</button></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/community/publish.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const publish = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-69577a77"]]);

export { publish as default };
//# sourceMappingURL=publish-BikJ6DyR.mjs.map
