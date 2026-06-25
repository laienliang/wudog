<script setup>
import { ref } from 'vue'
import { onLaunch } from '@dcloudio/uni-app'

const token = ref(uni.getStorageSync('token') || '')
const userInfo = ref(uni.getStorageSync('userInfo') || null)

function setToken(val) {
  token.value = val
  uni.setStorageSync('token', val)
}

function setUserInfo(val) {
  userInfo.value = val
  uni.setStorageSync('userInfo', val)
}

function getToken() {
  return token.value || uni.getStorageSync('token') || ''
}

function getUserInfo() {
  return userInfo.value || uni.getStorageSync('userInfo') || null
}

function clearAuth() {
  uni.removeStorageSync('token')
  uni.removeStorageSync('userInfo')
  token.value = ''
  userInfo.value = null
}

onLaunch(() => {
  console.log('乌东文旅小程序启动')
})
</script>

<style>
page {
  --color-ink: #12243a;
  --color-night: #153b5f;
  --color-indigo: #1f5fa8;
  --color-indigo-soft: #e7f0f8;
  --color-rice: #f7f0e4;
  --color-paper: #fffaf1;
  --color-cinnabar: #d84b2a;
  --color-ochre: #c79239;
  --color-moss: #5f7d50;
  --color-line: rgba(18, 36, 58, 0.12);
  --color-border-primary: rgba(18, 36, 58, 0.14);
  --color-border-secondary: rgba(18, 36, 58, 0.08);
  --color-text-primary: #172436;
  --color-text-secondary: #556477;
  --color-text-tertiary: #8a94a3;
  --color-bg-primary: #fffaf1;
  --color-bg-secondary: #f4efe6;
  --color-bg-tertiary: #ffffff;
  --color-primary: var(--color-indigo);
  --color-primary-dark: #0f3559;
  --color-primary-light: var(--color-indigo-soft);
  --color-secondary-orange: var(--color-cinnabar);
  --color-secondary-green: var(--color-moss);
  --color-secondary-gold: var(--color-ochre);
  --color-success: #3c8f5a;
  --color-warning: #d99a26;
  --color-error: #d94b4b;
  --space-xs: 8rpx;
  --space-sm: 12rpx;
  --space-md: 16rpx;
  --space-lg: 24rpx;
  --space-xl: 32rpx;
  --radius-sm: 8rpx;
  --radius-md: 14rpx;
  --radius-lg: 22rpx;
  --radius-full: 999rpx;
  --shadow-card: 0 18rpx 46rpx rgba(22, 42, 63, 0.10);

  font-family: 'Songti SC', 'STSong', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: var(--color-text-primary);
  background-color: var(--color-bg-secondary);
}

view,
text,
scroll-view,
swiper,
image,
input {
  box-sizing: border-box;
}

.miao-divider {
  height: 14rpx;
  background-image: repeating-linear-gradient(
    135deg,
    rgba(31, 95, 168, 0.14) 0,
    rgba(31, 95, 168, 0.14) 10rpx,
    transparent 10rpx,
    transparent 20rpx,
    rgba(216, 75, 42, 0.22) 20rpx,
    rgba(216, 75, 42, 0.22) 25rpx,
    transparent 25rpx,
    transparent 34rpx
  );
  background-color: var(--color-paper);
}

.card {
  background: var(--color-bg-primary);
  border: 1rpx solid rgba(18, 36, 58, 0.08);
  border-radius: 20rpx;
  padding: var(--space-md);
  margin: var(--space-md);
  box-shadow: var(--shadow-card);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-night), var(--color-indigo));
  color: #ffffff;
  border-radius: var(--radius-full);
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  text-align: center;
}

.btn-primary:active {
  background: var(--color-primary-dark);
}

.price {
  color: var(--color-cinnabar);
  font-weight: bold;
  font-size: 36rpx;
  font-family: 'DIN Condensed', 'Avenir Next Condensed', 'PingFang SC', sans-serif;
}

.price::before {
  content: '¥';
  font-size: 24rpx;
  margin-right: 2rpx;
}

.tag {
  display: inline-block;
  padding: 6rpx 14rpx;
  border: 1rpx solid rgba(31, 95, 168, 0.14);
  border-radius: var(--radius-full);
  font-size: 20rpx;
  background: rgba(255, 250, 241, 0.82);
  color: var(--color-night);
}

.tag-primary {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.tag-orange {
  background: #fff0e7;
  color: var(--color-cinnabar);
  border-color: rgba(216, 75, 42, 0.18);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 40rpx;
}

.empty-state .empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 32rpx;
  opacity: 0.4;
}

.empty-state .empty-text {
  font-size: 28rpx;
  color: var(--color-text-tertiary);
  text-align: center;
}

.safe-bottom {
  height: calc(env(safe-area-inset-bottom) + 28rpx);
}
</style>
