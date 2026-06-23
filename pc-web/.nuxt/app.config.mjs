
import { _replaceAppConfig } from '#app/config'
import { defuFn } from 'defu'

const inlineConfig = {
  "nuxt": {}
}

// Vite - webpack is handled directly in #app/config
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    _replaceAppConfig(newModule.default)
  })
}

import cfg0 from "/Users/lianglaiyang_1/svn/理工/2026课程/项目/wudog/pc-web/src/app.config.ts"

export default /*@__PURE__*/ defuFn(cfg0, inlineConfig)
