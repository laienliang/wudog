# 乌东文旅平台 - 微信小程序端

## 项目说明
原生微信小程序，与乌东文旅后端接口数据互通。

## 项目结构
```
miniprogram/
  app.js               # 小程序入口
  app.json             # 全局配置
  app.wxss             # 全局样式
  sitemap.json         # 小程序配置
  utils/
    request.js         # 请求封装
  pages/
    index/            # 首页/列表页
    detail/           # 详情页
    order/            # 下单页
```

## 运行步骤
1. 打开「微信开发者工具」
2. 选择「导入项目」
3. 项目目录选择 `miniprogram` 文件夹
4. 填入 AppID（测试可使用测试号）
5. 在项目设置中开启「不校验合法域名」
6. 确保后端服务运行在 `http://localhost:3000`
7. 编译运行

## 接口说明
- 基础URL：`http://localhost:3000`
- 列表页：`GET /api/accommodation`
- 详情页：`GET /api/accommodation/:id`
- 下单页：`POST /api/order`

## 注意事项
1. 本地开发时需在微信开发者工具中开启「不校验合法域名」
2. 真机调试时需要改为本机IP（如 `http://192.168.x.x:3000`）
3. 用户登录功能暂未实现，订单提交时使用模拟用户ID（userId=1）
