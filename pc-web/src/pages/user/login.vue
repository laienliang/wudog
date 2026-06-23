<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>乌东文旅</h1>
        <p>登录/注册，开启你的苗寨之旅</p>
      </div>

      <div class="login-form">
        <div class="form-tabs">
          <button :class="['form-tab', { active: activeTab === 'phone' }]" @click="activeTab = 'phone'">手机号登录</button>
          <button :class="['form-tab', { active: activeTab === 'wechat' }]" @click="activeTab = 'wechat'">微信登录</button>
        </div>

        <template v-if="activeTab === 'phone'">
          <div class="form-group">
            <input v-model="phone" type="tel" placeholder="请输入手机号" class="form-input" maxlength="11" />
          </div>
          <div class="form-group">
            <div class="code-row">
              <input v-model="code" type="text" placeholder="验证码" class="form-input" maxlength="6" />
              <button class="code-btn" @click="sendCode" :disabled="countdown > 0">
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>
          <button class="login-btn" @click="handleLogin">登录 / 注册</button>
          <p class="form-tip">登录即表示同意《用户协议》和《隐私政策》</p>
        </template>

        <template v-else>
          <div class="wechat-login">
            <div class="qr-placeholder">
              <p>打开微信扫一扫</p>
              <img src="https://via.placeholder.com/200x200/F7F8FA/1F5FA8?text=QR+Code" alt="微信登录二维码" class="qr-img" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('phone');
const phone = ref('');
const code = ref('');
const countdown = ref(0);

let timer: ReturnType<typeof setInterval> | null = null;

function sendCode() {
  if (!/^1\d{10}$/.test(phone.value)) {
    alert('请输入正确的手机号');
    return;
  }
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer!);
      timer = null;
    }
  }, 1000);
}

function handleLogin() {
  // TODO: 调用登录 API
  alert('登录功能待对接');
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: 40px 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  color: #fff;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 15px;
  opacity: 0.8;
}

.login-form {
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 40px;
  box-shadow: var(--shadow-deep);
}

.form-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  padding: 4px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.form-tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.form-tab.active {
  background: #fff;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--color-primary);
}

.code-row {
  display: flex;
  gap: 12px;
}

.code-btn {
  flex-shrink: 0;
  width: 120px;
  padding: 10px;
  border: 1px solid var(--color-primary);
  background: #fff;
  color: var(--color-primary);
  border-radius: var(--radius-md);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.code-btn:hover:not(:disabled) {
  background: var(--color-primary-light);
}

.code-btn:disabled {
  border-color: var(--color-text-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 14px;
  border: none;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover {
  background: var(--color-primary-dark);
}

.form-tip {
  font-size: 12px;
  color: var(--color-text-tertiary);
  text-align: center;
  margin-top: 16px;
}

.wechat-login {
  text-align: center;
}

.qr-placeholder {
  padding: 20px;
}

.qr-img {
  width: 200px;
  height: 200px;
  margin-top: 16px;
}
</style>
