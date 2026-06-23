import { _ as __nuxt_component_0 } from './nuxt-link-H66AYqpL.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "\u4E4C\u4E1C\u6587\u65C5 - \u82D7\u5BE8\u8863\u98DF\u4F4F\u884C\u7EFC\u5408\u670D\u52A1\u5E73\u53F0",
      meta: [
        { name: "description", content: "\u4F53\u9A8C\u8D35\u5DDE\u82D7\u65CF\u6587\u5316\uFF0C\u54C1\u5473\u82D7\u5BE8\u98CE\u60C5" }
      ]
    });
    const swiperModules = [Autoplay, Pagination, Navigation];
    const bannerActive = ref(0);
    const banners = [
      {
        image: "https://via.placeholder.com/1920x600/1F5FA8/FFFFFF?text=\u4E4C\u4E1C\u82D7\u5BE8",
        title: "\u8D70\u8FDB\u4E4C\u4E1C\u82D7\u5BE8",
        description: "\u5343\u5E74\u53E4\u5BE8\uFF0C\u82D7\u65CF\u6587\u5316\u7684\u6D3B\u5316\u77F3",
        link: "/lodging/list",
        cta: "\u63A2\u7D22\u82D7\u5BE8"
      },
      {
        image: "https://via.placeholder.com/1920x600/E85D2F/FFFFFF?text=\u82D7\u5BB6\u957F\u684C\u5BB4",
        title: "\u82D7\u5BB6\u957F\u684C\u5BB4",
        description: "\u54C1\u5473\u6700\u5730\u9053\u7684\u82D7\u5BB6\u7F8E\u98DF",
        link: "/food/restaurant",
        cta: "\u9884\u8BA2\u9910\u4F4D"
      },
      {
        image: "https://via.placeholder.com/1920x600/6B8E3D/FFFFFF?text=\u68AF\u7530\u98CE\u5149",
        title: "\u68AF\u7530\u98CE\u5149",
        description: "\u6F2B\u6B65\u91D1\u8272\u68AF\u7530\uFF0C\u611F\u53D7\u81EA\u7136\u4E4B\u7F8E",
        link: "/travel",
        cta: "\u67E5\u770B\u7EBF\u8DEF"
      }
    ];
    const modules = [
      { name: "\u8863", emoji: "\u{1F3EE}", description: "\u82D7\u65CF\u94F6\u9970\u3001\u8721\u67D3\u3001\u523A\u7EE3\u7B49\u975E\u9057\u624B\u5DE5\u827A\u54C1", path: "/clothing/list", color: "#1F5FA8" },
      { name: "\u98DF", emoji: "\u{1F372}", description: "\u82D7\u5BB6\u957F\u684C\u5BB4\u3001\u7279\u8272\u519C\u5BB6\u83DC\u3001\u519C\u4EA7\u54C1\u7279\u4EA7", path: "/food/restaurant", color: "#E85D2F" },
      { name: "\u4F4F", emoji: "\u{1F3E1}", description: "\u82D7\u5BE8\u540A\u811A\u697C\u6C11\u5BBF\u3001\u7279\u8272\u5BA2\u6808", path: "/lodging/list", color: "#6B8E3D" },
      { name: "\u884C", emoji: "\u{1F3AB}", description: "\u666F\u533A\u95E8\u7968\u3001\u65C5\u6E38\u8DEF\u7EBF\u5957\u9910\u3001\u4EA4\u901A\u653B\u7565", path: "/travel", color: "#D4A14B" }
    ];
    const hotTabs = [
      { label: "\u8863", key: "clothing" },
      { label: "\u98DF", key: "food" },
      { label: "\u4F4F", key: "lodging" },
      { label: "\u884C", key: "travel" }
    ];
    const activeTab = ref("clothing");
    const hotItems = {
      clothing: [
        { title: "\u82D7\u65CF\u94F6\u9970\u624B\u956F", subtitle: "\u624B\u5DE5\u953B\u9020\uFF0C\u4F20\u627F\u767E\u5E74\u5DE5\u827A", price: "368", image: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u94F6\u9970\u624B\u956F", link: "/clothing/detail/1", rating: 5, sales: 128 },
        { title: "\u8721\u67D3\u5E03\u827A\u6302\u753B", subtitle: "\u5929\u7136\u690D\u7269\u67D3\u6599\uFF0C\u7EAF\u624B\u5DE5\u5236\u4F5C", price: "198", image: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u8721\u67D3\u6302\u753B", link: "/clothing/detail/2", rating: 4, sales: 86 },
        { title: "\u82D7\u65CF\u523A\u7EE3\u9999\u5305", subtitle: "\u7CBE\u7F8E\u523A\u7EE3\uFF0C\u5929\u7136\u9999\u6599\u586B\u5145", price: "68", image: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u523A\u7EE3\u9999\u5305", link: "/clothing/detail/3", rating: 5, sales: 256 },
        { title: "\u82D7\u670D\u65E5\u5E38\u6B3E", subtitle: "\u4F20\u7EDF\u7EB9\u6837\uFF0C\u73B0\u4EE3\u526A\u88C1", price: "588", image: "https://via.placeholder.com/400x400/F7F8FA/1F5FA8?text=\u82D7\u670D", link: "/clothing/detail/4", rating: 5, sales: 42 }
      ],
      food: [
        { title: "\u82D7\u5BB6\u957F\u684C\u5BB4", subtitle: "\u6B63\u5B97\u82D7\u5BB6\u5473\u9053\uFF0C\u4EBA\u574788\u5143\u8D77", price: "88", image: "https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=\u957F\u684C\u5BB4", link: "/food/restaurant/1", rating: 5, likes: 320 },
        { title: "\u4E4C\u4E1C\u814A\u8089", subtitle: "\u70DF\u718F\u5DE5\u827A\uFF0C\u5730\u9053\u519C\u5BB6\u5473", price: "68", image: "https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=\u814A\u8089", link: "/food/agriculture/1", rating: 4, likes: 180 },
        { title: "\u9AD8\u5C71\u4E91\u96FE\u8336", subtitle: "\u6D77\u62D41500\u7C73\u8336\u56ED\u76F4\u4F9B", price: "128", image: "https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=\u8336\u53F6", link: "/food/agriculture/2", rating: 5, likes: 95 },
        { title: "\u624B\u5DE5\u7C73\u9152", subtitle: "\u4F20\u7EDF\u917F\u9020\uFF0C\u7518\u751C\u9187\u9999", price: "48", image: "https://via.placeholder.com/400x400/F7F8FA/E85D2F?text=\u7C73\u9152", link: "/food/agriculture/3", rating: 4, likes: 210 }
      ],
      lodging: [
        { title: "\u540A\u811A\u697C\u89C2\u666F\u623F", subtitle: "\u76F4\u9762\u68AF\u7530\uFF0C\u6668\u96FE\u7F2D\u7ED5", price: "388", image: "https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=\u540A\u811A\u697C", link: "/lodging/detail/1", rating: 5, likes: 156 },
        { title: "\u82D7\u5BE8\u5927\u5E8A\u623F", subtitle: "\u6728\u8D28\u7ED3\u6784\uFF0C\u6E29\u99A8\u8212\u9002", price: "268", image: "https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=\u5927\u5E8A\u623F", link: "/lodging/detail/2", rating: 4, likes: 89 },
        { title: "\u5EAD\u9662\u5957\u623F", subtitle: "\u72EC\u7ACB\u9662\u843D\uFF0C\u5E26\u9732\u53F0", price: "588", image: "https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=\u5957\u623F", link: "/lodging/detail/3", rating: 5, likes: 67 },
        { title: "\u5BB6\u5EAD\u6728\u5C4B", subtitle: "\u4E24\u5BA4\u4E24\u5385\uFF0C\u9002\u5408\u5BB6\u5EAD\u51FA\u6E38", price: "788", image: "https://via.placeholder.com/400x400/F7F8FA/6B8E3D?text=\u5BB6\u5EAD\u623F", link: "/lodging/detail/4", rating: 5, likes: 43 }
      ],
      travel: [
        { title: "\u4E4C\u4E1C\u82D7\u5BE8\u4E00\u65E5\u6E38", subtitle: "\u542B\u4E09\u9910+\u5BFC\u6E38+\u95E8\u7968", price: "298", image: "https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=\u4E00\u65E5\u6E38", link: "/travel/route/1", rating: 5, likes: 420 },
        { title: "\u68AF\u7530\u5F92\u6B65\u4E24\u65E5\u6E38", subtitle: "\u6DF1\u5EA6\u4F53\u9A8C\u82D7\u5BE8\u751F\u6D3B", price: "498", image: "https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=\u4E24\u65E5\u6E38", link: "/travel/route/2", rating: 4, likes: 180 },
        { title: "\u82D7\u5E74\u8282\u5E86\u5957\u9910", subtitle: "\u4F53\u9A8C\u6700\u5730\u9053\u7684\u82D7\u5E74", price: "588", image: "https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=\u82D7\u5E74", link: "/travel/route/3", rating: 5, likes: 310 },
        { title: "\u94F6\u9970\u953B\u9020\u4F53\u9A8C", subtitle: "\u4EB2\u624B\u5236\u4F5C\u94F6\u9970\u7EAA\u5FF5\u54C1", price: "168", image: "https://via.placeholder.com/400x400/F7F8FA/D4A14B?text=\u94F6\u9970\u4F53\u9A8C", link: "/travel/route/4", rating: 5, likes: 95 }
      ]
    };
    const displayedItems = computed(() => hotItems[activeTab.value] || []);
    const articles = [
      { title: "\u4E4C\u4E1C\u82D7\u5BE8\u7684\u6E05\u6668\uFF0C\u4E91\u96FE\u4E2D\u7684\u540A\u811A\u697C", cover: "https://via.placeholder.com/600x400/F7F8FA/1F5FA8?text=\u82D7\u5BE8\u6E05\u6668", author: "\u65C5\u884C\u8005\u5C0F\u738B", authorAvatar: "https://via.placeholder.com/40x40/E8F1FB/1F5FA8?text=W", likes: 128, comments: 36 },
      { title: "\u7B2C\u4E00\u6B21\u6765\u4E4C\u4E1C\uFF0C\u5C31\u88AB\u957F\u684C\u5BB4\u9707\u64BC\u4E86", cover: "https://via.placeholder.com/600x400/F7F8FA/E85D2F?text=\u957F\u684C\u5BB4", author: "\u7F8E\u98DF\u8FBE\u4EBA", authorAvatar: "https://via.placeholder.com/40x40/FFF1EA/E85D2F?text=M", likes: 256, comments: 82 },
      { title: "\u4E4C\u4E1C\u68AF\u7530\uFF0C\u79CB\u5929\u7684\u91D1\u8272\u753B\u5377", cover: "https://via.placeholder.com/600x400/F7F8FA/6B8E3D?text=\u68AF\u7530", author: "\u6444\u5F71\u5E08\u8001\u674E", authorAvatar: "https://via.placeholder.com/40x40/F6FFED/6B8E3D?text=L", likes: 342, comments: 48 },
      { title: "\u4EB2\u624B\u6253\u4E86\u4E00\u53EA\u94F6\u956F\u5B50\u2014\u2014\u4E4C\u4E1C\u94F6\u9970\u4F53\u9A8C", cover: "https://via.placeholder.com/600x400/F7F8FA/D4A14B?text=\u94F6\u9970", author: "\u624B\u5DE5\u827A\u7231\u597D\u8005", authorAvatar: "https://via.placeholder.com/40x40/FFF7E6/D4A14B?text=H", likes: 189, comments: 55 }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-page" }, _attrs))} data-v-5a53c9c7><section class="hero-banner" data-v-5a53c9c7>`);
      _push(ssrRenderComponent(unref(Swiper), {
        modelValue: bannerActive.value,
        "onUpdate:modelValue": ($event) => bannerActive.value = $event,
        modules: swiperModules,
        "slides-per-view": 1,
        autoplay: { delay: 4e3 },
        loop: true,
        pagination: { clickable: true }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(banners, (banner, idx) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), { key: idx }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="banner-item" style="${ssrRenderStyle({ backgroundImage: `url(${banner.image})` })}" data-v-5a53c9c7${_scopeId2}><div class="banner-overlay" data-v-5a53c9c7${_scopeId2}><h1 class="banner-title" data-v-5a53c9c7${_scopeId2}>${ssrInterpolate(banner.title)}</h1><p class="banner-desc" data-v-5a53c9c7${_scopeId2}>${ssrInterpolate(banner.description)}</p>`);
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: banner.link,
                      class: "btn btn-primary btn-lg"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(banner.cta)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(banner.cta), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div></div>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: "banner-item",
                        style: { backgroundImage: `url(${banner.image})` }
                      }, [
                        createVNode("div", { class: "banner-overlay" }, [
                          createVNode("h1", { class: "banner-title" }, toDisplayString(banner.title), 1),
                          createVNode("p", { class: "banner-desc" }, toDisplayString(banner.description), 1),
                          createVNode(_component_NuxtLink, {
                            to: banner.link,
                            class: "btn btn-primary btn-lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(banner.cta), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ])
                      ], 4)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(banners, (banner, idx) => {
                return createVNode(unref(SwiperSlide), { key: idx }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "banner-item",
                      style: { backgroundImage: `url(${banner.image})` }
                    }, [
                      createVNode("div", { class: "banner-overlay" }, [
                        createVNode("h1", { class: "banner-title" }, toDisplayString(banner.title), 1),
                        createVNode("p", { class: "banner-desc" }, toDisplayString(banner.description), 1),
                        createVNode(_component_NuxtLink, {
                          to: banner.link,
                          class: "btn btn-primary btn-lg"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(banner.cta), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ])
                    ], 4)
                  ]),
                  _: 2
                }, 1024);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><div class="miao-divider" data-v-5a53c9c7></div><section class="module-entrances" data-v-5a53c9c7><div class="container" data-v-5a53c9c7><div class="module-grid" data-v-5a53c9c7><!--[-->`);
      ssrRenderList(modules, (mod, idx) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: idx,
          to: mod.path,
          class: "module-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="module-icon" style="${ssrRenderStyle({ backgroundColor: mod.color })}" data-v-5a53c9c7${_scopeId}><span class="module-emoji" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(mod.emoji)}</span></div><h3 class="module-name" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(mod.name)}</h3><p class="module-desc" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(mod.description)}</p>`);
            } else {
              return [
                createVNode("div", {
                  class: "module-icon",
                  style: { backgroundColor: mod.color }
                }, [
                  createVNode("span", { class: "module-emoji" }, toDisplayString(mod.emoji), 1)
                ], 4),
                createVNode("h3", { class: "module-name" }, toDisplayString(mod.name), 1),
                createVNode("p", { class: "module-desc" }, toDisplayString(mod.description), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section><section class="hot-section" data-v-5a53c9c7><div class="container" data-v-5a53c9c7><div class="section-header" data-v-5a53c9c7><h2 class="section-title" data-v-5a53c9c7>\u70ED\u95E8\u63A8\u8350</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/clothing/list",
        class: "section-more"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u67E5\u770B\u5168\u90E8 \u203A`);
          } else {
            return [
              createTextVNode("\u67E5\u770B\u5168\u90E8 \u203A")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hot-tabs" data-v-5a53c9c7><!--[-->`);
      ssrRenderList(hotTabs, (tab) => {
        _push(`<button class="${ssrRenderClass(["hot-tab", { active: activeTab.value === tab.key }])}" data-v-5a53c9c7>${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="hot-grid" data-v-5a53c9c7><!--[-->`);
      ssrRenderList(displayedItems.value, (item, idx) => {
        _push(`<div class="goods-card" data-v-5a53c9c7>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.link,
          class: "goods-card-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.title)} class="goods-card-img" data-v-5a53c9c7${_scopeId}><div class="goods-card-body" data-v-5a53c9c7${_scopeId}><h3 class="goods-card-title" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="goods-card-subtitle" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(item.subtitle)}</p><div class="goods-card-footer" data-v-5a53c9c7${_scopeId}><span class="price" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(item.price)}</span><span class="goods-card-meta" data-v-5a53c9c7${_scopeId}><span class="rating" data-v-5a53c9c7${_scopeId}><!--[-->`);
              ssrRenderList(5, (s) => {
                _push2(`<span class="${ssrRenderClass(["star", { filled: s <= item.rating }])}" data-v-5a53c9c7${_scopeId}>\u2605</span>`);
              });
              _push2(`<!--]--></span><span data-v-5a53c9c7${_scopeId}>${ssrInterpolate(item.sales || item.likes || 0)}</span></span></div></div>`);
            } else {
              return [
                createVNode("img", {
                  src: item.image,
                  alt: item.title,
                  class: "goods-card-img"
                }, null, 8, ["src", "alt"]),
                createVNode("div", { class: "goods-card-body" }, [
                  createVNode("h3", { class: "goods-card-title" }, toDisplayString(item.title), 1),
                  createVNode("p", { class: "goods-card-subtitle" }, toDisplayString(item.subtitle), 1),
                  createVNode("div", { class: "goods-card-footer" }, [
                    createVNode("span", { class: "price" }, toDisplayString(item.price), 1),
                    createVNode("span", { class: "goods-card-meta" }, [
                      createVNode("span", { class: "rating" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(5, (s) => {
                          return createVNode("span", {
                            key: s,
                            class: ["star", { filled: s <= item.rating }]
                          }, "\u2605", 2);
                        }), 64))
                      ]),
                      createVNode("span", null, toDisplayString(item.sales || item.likes || 0), 1)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section><section class="article-section" data-v-5a53c9c7><div class="container" data-v-5a53c9c7><div class="section-header" data-v-5a53c9c7><h2 class="section-title" data-v-5a53c9c7>\u7CBE\u9009\u6E38\u8BB0</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/community/feed",
        class: "section-more"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u66F4\u591A\u6E38\u8BB0 \u203A`);
          } else {
            return [
              createTextVNode("\u66F4\u591A\u6E38\u8BB0 \u203A")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="article-grid" data-v-5a53c9c7><!--[-->`);
      ssrRenderList(articles, (art, idx) => {
        _push(`<div class="article-card" data-v-5a53c9c7>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/community/article/1",
          class: "article-card-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", art.cover)} alt="" class="article-card-img" data-v-5a53c9c7${_scopeId}><div class="article-card-body" data-v-5a53c9c7${_scopeId}><h3 class="article-card-title" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(art.title)}</h3><div class="article-card-meta" data-v-5a53c9c7${_scopeId}><img${ssrRenderAttr("src", art.authorAvatar)} alt="" class="author-avatar" data-v-5a53c9c7${_scopeId}><span class="author-name" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(art.author)}</span><span class="article-stats" data-v-5a53c9c7${_scopeId}>${ssrInterpolate(art.likes)}\u8D5E \xB7 ${ssrInterpolate(art.comments)}\u8BC4</span></div></div>`);
            } else {
              return [
                createVNode("img", {
                  src: art.cover,
                  alt: "",
                  class: "article-card-img"
                }, null, 8, ["src"]),
                createVNode("div", { class: "article-card-body" }, [
                  createVNode("h3", { class: "article-card-title" }, toDisplayString(art.title), 1),
                  createVNode("div", { class: "article-card-meta" }, [
                    createVNode("img", {
                      src: art.authorAvatar,
                      alt: "",
                      class: "author-avatar"
                    }, null, 8, ["src"]),
                    createVNode("span", { class: "author-name" }, toDisplayString(art.author), 1),
                    createVNode("span", { class: "article-stats" }, toDisplayString(art.likes) + "\u8D5E \xB7 " + toDisplayString(art.comments) + "\u8BC4", 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section><section class="about-section" data-v-5a53c9c7><div class="container about-inner" data-v-5a53c9c7><div class="about-text" data-v-5a53c9c7><h2 data-v-5a53c9c7>\u5173\u4E8E\u4E4C\u4E1C\u6587\u65C5</h2><p data-v-5a53c9c7>\u4E4C\u4E1C\u6751\u662F\u8D35\u5DDE\u9ED4\u4E1C\u5357\u82D7\u65CF\u4F97\u65CF\u81EA\u6CBB\u5DDE\u6700\u5177\u7279\u8272\u7684\u82D7\u5BE8\u4E4B\u4E00\uFF0C\u62E5\u6709\u5343\u5E74\u5386\u53F2\u7684\u540A\u811A\u697C\u5EFA\u7B51\u7FA4\u3001\u7CBE\u7F8E\u7684\u94F6\u9970\u953B\u9020\u6280\u827A\u3001\u72EC\u7279\u7684\u8721\u67D3\u523A\u7EE3\u5DE5\u827A\u3002</p><p data-v-5a53c9c7>\u672C\u5E73\u53F0\u81F4\u529B\u4E8E\u4E3A\u6E38\u5BA2\u63D0\u4F9B\u4E00\u7AD9\u5F0F&quot;\u8863\u3001\u98DF\u3001\u4F4F\u3001\u884C\u3001\u793E\u533A&quot;\u7EBF\u4E0A\u670D\u52A1\uFF0C\u8BA9\u60A8\u8DB3\u4E0D\u51FA\u6237\u5373\u53EF\u611F\u53D7\u82D7\u5BE8\u98CE\u60C5\u3002</p></div><div class="about-stats" data-v-5a53c9c7><div class="stat-item" data-v-5a53c9c7><span class="stat-num" data-v-5a53c9c7>50+</span><span class="stat-label" data-v-5a53c9c7>\u5165\u9A7B\u5546\u5BB6</span></div><div class="stat-item" data-v-5a53c9c7><span class="stat-num" data-v-5a53c9c7>200+</span><span class="stat-label" data-v-5a53c9c7>\u975E\u9057\u5546\u54C1</span></div><div class="stat-item" data-v-5a53c9c7><span class="stat-num" data-v-5a53c9c7>1000+</span><span class="stat-label" data-v-5a53c9c7>\u6708\u6D3B\u7528\u6237</span></div><div class="stat-item" data-v-5a53c9c7><span class="stat-num" data-v-5a53c9c7>500+</span><span class="stat-label" data-v-5a53c9c7>\u6E38\u8BB0\u5206\u4EAB</span></div></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5a53c9c7"]]);

export { index as default };
//# sourceMappingURL=index-DdBxvWCp.mjs.map
