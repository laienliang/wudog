<template>
  <footer class="site-footer">
    <div class="miao-divider"></div>
    <div class="container footer-inner">
      <div class="footer-cols">
        <div class="footer-col">
          <div class="footer-brand">
            <img :src="logoSrc" alt="乌东文旅" />
            <h4>乌东文旅</h4>
          </div>
          <p>体验贵州苗族文化，品味苗寨风情</p>
        </div>
        <div class="footer-col">
          <h4>业务模块</h4>
          <ul>
            <li><NuxtLink to="/clothing/list">非遗商品</NuxtLink></li>
            <li><NuxtLink to="/food/restaurant">美食餐厅</NuxtLink></li>
            <li><NuxtLink to="/lodging/list">特色民宿</NuxtLink></li>
            <li><NuxtLink to="/travel">景区线路</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>帮助中心</h4>
          <ul>
            <li><a href="#">预订说明</a></li>
            <li><a href="#">退款政策</a></li>
            <li><a href="#">常见问题</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>联系我们</h4>
          <ul>
            <li>电话：400-XXX-XXXX</li>
            <li>地址：贵州省黔东南州</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 乌东文旅 "衣食住行"综合服务平台 · 仅供教学演示</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const logoSrc = '/logo-wudong.png';
</script>

<style lang="scss" scoped>
.site-footer {
  background: var(--color-text-primary);
  color: rgba(255, 255, 255, 0.7);
  margin-top: auto;
}

.footer-inner {
  padding: 48px 0 24px;
}

.footer-cols {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 40px;
}

.footer-col h4 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 16px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-brand img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  transform: scale(1.18);
  box-shadow: 0 0 0 2px rgba(212, 161, 75, 0.32);
}

.footer-brand h4 {
  margin-bottom: 0;
}

.footer-col p {
  font-size: 13px;
  line-height: 1.8;
}

.footer-col ul {
  list-style: none;
}

.footer-col li {
  margin-bottom: 10px;
  font-size: 13px;
}

.footer-col a,
.footer-col li a {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s;
}

.footer-col a:hover {
  color: #fff;
}

.footer-bottom {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .footer-cols {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
</style>
