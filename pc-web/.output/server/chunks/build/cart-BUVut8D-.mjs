import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    const cartItems = ref([
      { id: 1, title: "\u82D7\u65CF\u94F6\u9970\u624B\u956F", spec: "\u4E2D\u53F7\uFF08\u5185\u5F8456mm\uFF09", description: "\u624B\u5DE5\u953B\u9020\uFF0C\u4F20\u627F\u767E\u5E74\u5DE5\u827A", price: 368, quantity: 1, checked: true, image: "https://via.placeholder.com/120x120/F7F8FA/1F5FA8?text=\u624B\u956F" },
      { id: 2, title: "\u8721\u67D3\u5E03\u827A\u6302\u753B", spec: "60\xD780cm", description: "\u5929\u7136\u690D\u7269\u67D3\u6599\uFF0C\u7EAF\u624B\u5DE5\u5236\u4F5C", price: 198, quantity: 2, checked: true, image: "https://via.placeholder.com/120x120/F7F8FA/1F5FA8?text=\u8721\u67D3" },
      { id: 3, title: "\u82D7\u7EE3\u9999\u5305", spec: "\u7EA2\u8272", description: "\u7CBE\u7F8E\u523A\u7EE3\uFF0C\u5929\u7136\u9999\u6599", price: 68, quantity: 1, checked: false, image: "https://via.placeholder.com/120x120/F7F8FA/1F5FA8?text=\u9999\u5305" }
    ]);
    const allChecked = computed(() => cartItems.value.length > 0 && cartItems.value.every((i) => i.checked));
    const selectedCount = computed(() => cartItems.value.filter((i) => i.checked).reduce((s, i) => s + i.quantity, 0));
    const totalPrice = computed(() => cartItems.value.filter((i) => i.checked).reduce((s, i) => s + i.price * i.quantity, 0));
    useHead({
      title: "\u8D2D\u7269\u8F66 - \u4E4C\u4E1C\u6587\u65C5",
      meta: [{ name: "description", content: "\u67E5\u770B\u548C\u7BA1\u7406\u60A8\u7684\u8D2D\u7269\u8F66\u5546\u54C1" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cart-page" }, _attrs))} data-v-d4245b68><div class="container page-inner" data-v-d4245b68><div class="page-header" data-v-d4245b68><h1 data-v-d4245b68>\u8D2D\u7269\u8F66</h1></div><div class="miao-divider" data-v-d4245b68></div>`);
      if (cartItems.value.length) {
        _push(`<div class="cart-list" data-v-d4245b68><!--[-->`);
        ssrRenderList(cartItems.value, (item, idx) => {
          _push(`<div class="cart-item" data-v-d4245b68><input type="checkbox"${ssrIncludeBooleanAttr(item.checked) ? " checked" : ""} class="cart-checkbox" data-v-d4245b68><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.title)} class="cart-img" data-v-d4245b68><div class="cart-info" data-v-d4245b68><h3 class="cart-title" data-v-d4245b68>${ssrInterpolate(item.title)}</h3><p class="cart-spec" data-v-d4245b68>${ssrInterpolate(item.spec)}</p><p class="cart-desc" data-v-d4245b68>${ssrInterpolate(item.description)}</p></div><div class="cart-quantity" data-v-d4245b68><button class="qty-btn" data-v-d4245b68>-</button><span class="qty-value" data-v-d4245b68>${ssrInterpolate(item.quantity)}</span><button class="qty-btn" data-v-d4245b68>+</button></div><span class="cart-price" data-v-d4245b68>\xA5${ssrInterpolate((item.price * item.quantity).toFixed(2))}</span><button class="cart-remove" data-v-d4245b68>\xD7</button></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty-state" data-v-d4245b68><div class="empty-icon" data-v-d4245b68>\u{1F6D2}</div><p class="empty-text" data-v-d4245b68>\u8D2D\u7269\u8F66\u8FD8\u662F\u7A7A\u7684</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/clothing/list",
          class: "btn btn-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u53BB\u901B\u901B`);
            } else {
              return [
                createTextVNode("\u53BB\u901B\u901B")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      if (cartItems.value.length) {
        _push(`<div class="checkout-bar" data-v-d4245b68><div class="checkout-info" data-v-d4245b68><label class="check-all" data-v-d4245b68><input type="checkbox"${ssrIncludeBooleanAttr(allChecked.value) ? " checked" : ""} data-v-d4245b68><span data-v-d4245b68>\u5168\u9009</span></label><span class="total-text" data-v-d4245b68>\u5171\u8BA1 ${ssrInterpolate(selectedCount.value)} \u4EF6</span></div><div class="checkout-total" data-v-d4245b68><span class="total-label" data-v-d4245b68>\u5408\u8BA1\uFF1A</span><span class="total-price" data-v-d4245b68>\xA5${ssrInterpolate(totalPrice.value.toFixed(2))}</span><button class="checkout-btn" data-v-d4245b68>\u53BB\u7ED3\u7B97</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cart = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d4245b68"]]);

export { cart as default };
//# sourceMappingURL=cart-BUVut8D-.mjs.map
