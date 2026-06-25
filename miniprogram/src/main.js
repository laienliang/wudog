import { createSSRApp } from 'vue'
import App from './App.vue'

let toastPatched = false

function patchUnexpectedSuccessToast() {
  if (toastPatched || !uni?.showToast) return

  const rawShowToast = uni.showToast.bind(uni)
  uni.showToast = function patchedShowToast(options = {}) {
    const title = String(options?.title || '').trim().toLowerCase()

    // 过滤来源不明的默认 success 提示，保留业务里明确写出的中文反馈。
    if (title === 'success') {
      return
    }

    return rawShowToast(options)
  }

  toastPatched = true
}

export function createApp() {
  patchUnexpectedSuccessToast()
  const app = createSSRApp(App)
  return {
    app,
  }
}
