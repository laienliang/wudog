<template>
  <div class="login-page">
    <div class="login-backdrop">
      <span class="backdrop-orb orb-blue"></span>
      <span class="backdrop-orb orb-gold"></span>
      <span class="backdrop-orb orb-orange"></span>
    </div>

    <div class="login-shell">
      <section class="brand-panel">
        <p class="brand-kicker">WU DONG CULTURE JOURNEY</p>
        <h1>让一场苗寨旅行，从登录开始有仪式感。</h1>
        <p class="brand-description">
          连接乌东的衣、食、住、行与社区分享。一个账号，即可收藏行程、预订民宿、记录游记。
        </p>

        <div class="brand-footer">
          <div class="footnote">
            <span class="footnote-label">本季主推</span>
            <strong>苗年节庆 · 长桌宴 · 吊脚楼夜宿</strong>
          </div>
          <div class="pattern-strip" aria-hidden="true"></div>
        </div>
      </section>

      <section class="login-panel">
        <div class="panel-topbar">
          <NuxtLink to="/" class="back-home">返回首页</NuxtLink>
          <span class="safe-status">安全登录入口</span>
        </div>

        <div class="panel-header">
          <h2>欢迎回来</h2>
          <p>选择手机号快速登录，或使用微信扫码进入你的旅行账户。</p>
        </div>

        <div class="form-tabs" role="tablist" aria-label="登录方式切换">
          <button
            type="button"
            :class="['form-tab', { active: activeTab === 'phone' }]"
            @click="activeTab = 'phone'"
          >
            手机号登录
          </button>
          <button
            type="button"
            :class="['form-tab', { active: activeTab === 'wechat' }]"
            @click="activeTab = 'wechat'"
          >
            微信登录
          </button>
        </div>

        <template v-if="activeTab === 'phone'">
          <form class="login-form" @submit.prevent="handleLogin">
            <label class="form-group">
              <span class="field-label">手机号</span>
              <input
                v-model="phone"
                type="tel"
                inputmode="numeric"
                placeholder="请输入 11 位手机号"
                class="form-input"
                maxlength="11"
              />
            </label>

            <label class="form-group">
              <span class="field-label">短信验证码</span>
              <div class="code-row">
                <input
                  v-model="code"
                  type="text"
                  inputmode="numeric"
                  placeholder="请输入 6 位验证码"
                  class="form-input"
                  maxlength="6"
                />
                <button
                  type="button"
                  class="code-btn"
                  @click="sendCode"
                  :disabled="countdown > 0"
                >
                  {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
                </button>
              </div>
            </label>

            <div class="service-row">
              <span>未注册手机号将自动创建账户</span>
              <a href="#agreement">查看协议</a>
            </div>

            <button type="submit" class="login-btn">登录 / 注册</button>

            <p class="form-tip">
              登录即表示同意《用户协议》《隐私政策》并授权平台为你同步订单、收藏与游记数据。
            </p>
          </form>
        </template>

        <template v-else>
          <div class="wechat-login">
            <div class="qr-card">
              <div class="qr-frame">
                <div class="qr-mock">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="qr-copy">
                <h3>打开微信扫一扫</h3>
                <p>扫码后可同步订单、游记草稿和收藏清单，适合常用微信的游客与商户。</p>
              </div>
            </div>

            <div class="wechat-tips">
              <span>1 分钟内有效</span>
              <span>支持自动注册</span>
              <span>登录后可绑定手机号</span>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ElMessage } from 'element-plus';

useHead({
  title: '登录 / 注册 - 乌东文旅',
  meta: [
    { name: 'description', content: '乌东文旅登录与注册入口，快速进入苗寨衣食住行与社区服务。' },
  ],
});

definePageMeta({
  layout: false,
});

type LoginTab = 'phone' | 'wechat';

const activeTab = ref<LoginTab>('phone');
const phone = ref('');
const code = ref('');
const countdown = ref(0);

let timer: ReturnType<typeof setInterval> | null = null;

function clearCountdownTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function sendCode() {
  if (!/^1\d{10}$/.test(phone.value)) {
    ElMessage.warning('请输入正确的手机号');
    return;
  }

  ElMessage.success('验证码已发送，当前为演示流程');
  countdown.value = 60;
  clearCountdownTimer();

  timer = setInterval(() => {
    if (countdown.value <= 1) {
      countdown.value = 0;
      clearCountdownTimer();
      return;
    }

    countdown.value -= 1;
  }, 1000);
}

function handleLogin() {
  if (!/^1\d{10}$/.test(phone.value)) {
    ElMessage.warning('请输入正确的手机号');
    return;
  }

  if (!/^\d{6}$/.test(code.value)) {
    ElMessage.warning('请输入 6 位验证码');
    return;
  }

  ElMessage.info('登录功能待对接');
}

onBeforeUnmount(() => {
  clearCountdownTimer();
});
</script>

<style lang="scss" scoped>
.login-page {
  --login-bg: #071521;
  --login-panel: rgba(7, 21, 33, 0.76);
  --login-card: rgba(255, 255, 255, 0.94);
  --login-border: rgba(255, 255, 255, 0.16);
  --login-gold: #d4a14b;
  --login-orange: #e07a3f;
  --login-blue-soft: #8eb8e8;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(212, 161, 75, 0.16), transparent 28%),
    radial-gradient(circle at 85% 18%, rgba(31, 95, 168, 0.22), transparent 24%),
    linear-gradient(135deg, #08131d 0%, #0d2234 48%, #153251 100%);
}

.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 90%);
  pointer-events: none;
}

.login-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.backdrop-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.7;
  animation: drift 14s ease-in-out infinite;
}

.orb-blue {
  top: 10%;
  right: 12%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(142, 184, 232, 0.45), transparent 72%);
}

.orb-gold {
  bottom: 12%;
  left: 7%;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(212, 161, 75, 0.32), transparent 70%);
  animation-delay: -4s;
}

.orb-orange {
  top: 42%;
  left: 42%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(224, 122, 63, 0.28), transparent 70%);
  animation-delay: -7s;
}

.login-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(380px, 520px);
  gap: 32px;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 32px;
}

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 620px;
  padding: 44px;
  border: 1px solid var(--login-border);
  border-radius: 32px;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    rgba(5, 16, 26, 0.44);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(24px);
}

.brand-panel::after {
  content: '';
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(212, 161, 75, 0.18);
  border-radius: 24px;
  pointer-events: none;
}

.brand-kicker {
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-size: 12px;
}
.brand-kicker {
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 18px;
}

.brand-panel h1 {
  max-width: 11ch;
  font-family: 'Baskerville', 'Times New Roman', 'Songti SC', 'STSong', serif;
  font-size: clamp(38px, 4.2vw, 64px);
  line-height: 1.04;
  color: #f7f0e4;
  margin-bottom: 16px;
}

.brand-description {
  max-width: 560px;
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.78);
}

.brand-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 32px;
}

.footnote {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.82);
}

.footnote-label {
  color: rgba(255, 255, 255, 0.52);
  font-size: 12px;
  letter-spacing: 0.18em;
}

.pattern-strip {
  width: 220px;
  height: 48px;
  border-radius: 999px;
  background:
    linear-gradient(135deg, transparent 18%, rgba(255, 255, 255, 0.18) 18% 22%, transparent 22% 40%, rgba(212, 161, 75, 0.6) 40% 44%, transparent 44% 62%, rgba(224, 122, 63, 0.6) 62% 66%, transparent 66%),
    rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.login-panel {
  align-self: center;
  padding: 24px;
  border-radius: 32px;
  background: var(--login-card);
  box-shadow: 0 26px 70px rgba(2, 9, 16, 0.34);
}

.panel-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 34px;
}

.back-home,
.safe-status {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 13px;
}

.back-home {
  color: var(--color-primary);
  background: rgba(31, 95, 168, 0.08);
}

.safe-status {
  color: #0f5f47;
  background: rgba(82, 196, 26, 0.12);
}

.panel-header {
  margin-bottom: 22px;
}

.panel-header h2 {
  font-family: 'Baskerville', 'Times New Roman', 'Songti SC', 'STSong', serif;
  font-size: 36px;
  line-height: 1.1;
  color: #102033;
  margin-bottom: 8px;
}

.panel-header p {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.form-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 8px;
  margin-bottom: 22px;
  border-radius: 20px;
  background: #eef3f8;
}

.form-tab {
  height: 50px;
  border: none;
  border-radius: 16px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.25s ease, color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.form-tab.active {
  background: linear-gradient(135deg, #ffffff, #f7fbff);
  color: #0f2b4b;
  box-shadow: 0 10px 24px rgba(31, 95, 168, 0.12);
  transform: translateY(-1px);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #25384d;
}

.form-input {
  width: 100%;
  height: 56px;
  padding: 0 18px;
  border: 1px solid #d5dfeb;
  border-radius: 18px;
  background: rgba(247, 250, 252, 0.95);
  color: #102033;
  font-size: 15px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.form-input:focus {
  background: #fff;
  border-color: rgba(31, 95, 168, 0.5);
  box-shadow: 0 0 0 4px rgba(31, 95, 168, 0.08);
}

.code-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px;
  gap: 12px;
}

.code-btn,
.login-btn {
  border: none;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.code-btn {
  border-radius: 18px;
  background: #102c4a;
  color: #f7f3ea;
  font-size: 14px;
}

.code-btn:hover:not(:disabled),
.login-btn:hover {
  transform: translateY(-2px);
}

.code-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.service-row a {
  color: var(--color-primary);
}

.login-btn {
  height: 58px;
  border-radius: 20px;
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background:
    linear-gradient(135deg, #143c65 0%, #1f5fa8 52%, #d4a14b 140%);
  box-shadow: 0 18px 30px rgba(31, 95, 168, 0.2);
}

.form-tip {
  font-size: 12px;
  line-height: 1.8;
  color: var(--color-text-tertiary);
}

.wechat-login {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.qr-card {
  padding: 22px;
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(31, 95, 168, 0.08), rgba(212, 161, 75, 0.08)),
    #f8fbfd;
  border: 1px solid rgba(31, 95, 168, 0.12);
}

.qr-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  margin-bottom: 18px;
  border-radius: 24px;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(31, 95, 168, 0.08);
}

.qr-mock {
  position: relative;
  width: min(100%, 240px);
  aspect-ratio: 1;
  border-radius: 16px;
  background:
    linear-gradient(90deg, #112a44 10px, transparent 10px) 0 0 / 40px 40px,
    linear-gradient(#112a44 10px, transparent 10px) 0 0 / 40px 40px,
    linear-gradient(90deg, transparent 30px, #112a44 30px 40px) 0 0 / 40px 40px,
    linear-gradient(transparent 30px, #112a44 30px 40px) 0 0 / 40px 40px,
    #f8f8f8;
  overflow: hidden;
}

.qr-mock span {
  position: absolute;
  width: 54px;
  height: 54px;
  border: 8px solid #112a44;
  border-radius: 12px;
  background: #fff;
}

.qr-mock span:nth-child(1) { top: 16px; left: 16px; }
.qr-mock span:nth-child(2) { top: 16px; right: 16px; }
.qr-mock span:nth-child(3) { bottom: 16px; left: 16px; }
.qr-mock span:nth-child(4) { top: calc(50% - 27px); left: calc(50% - 27px); width: 42px; height: 42px; border-width: 6px; }
.qr-mock span:nth-child(5) { bottom: 38px; right: 42px; width: 26px; height: 26px; border-width: 5px; border-radius: 8px; }

.qr-copy h3 {
  font-size: 24px;
  color: #102033;
  margin-bottom: 8px;
}

.qr-copy p {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.wechat-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.wechat-tips span {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: #365372;
  background: rgba(31, 95, 168, 0.08);
}

@keyframes drift {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -18px, 0) scale(1.05);
  }
}

@media (max-width: 1180px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    min-height: auto;
  }

  .brand-panel h1 {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .login-shell {
    padding: 16px;
    gap: 18px;
  }

  .brand-panel,
  .login-panel {
    padding: 24px;
    border-radius: 24px;
  }

  .brand-footer,
  .service-row,
  .panel-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .pattern-strip {
    width: 100%;
  }

  .panel-header h2 {
    font-size: 34px;
  }

  .code-row {
    grid-template-columns: 1fr;
  }

  .code-btn,
  .login-btn,
  .form-input {
    height: 52px;
  }
}
</style>
