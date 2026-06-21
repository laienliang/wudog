# 乌东文旅平台管理后台

## 项目概况

**项目名称：** `wudong-admin-frontend`

## 技术栈

- React 18 + TypeScript + Vite 5
- Ant Design 5 (中文语言包)
- React Router 6
- ECharts (图表)
- Axios (HTTP 请求)

## 项目结构

```
admin/src/
├── components/        # 公共组件 (ImageUpload, Captcha)
├── layouts/           # 布局 (MainLayout)
├── pages/
│   ├── admin/         # 管理员管理 (管理员列表、角色列表)
│   ├── user/          # 用户管理
│   ├── merchant/      # 商家管理 (商家列表、入驻申请)
│   ├── content/       # 内容管理 (公告、轮播图、Banner、推荐)
│   ├── order/         # 订单管理 (订单列表、退款审批、异常订单)
│   ├── message/       # 消息管理 (消息列表、模板管理)
│   ├── finance/       # 财务管理 (结算、报表、对账)
│   ├── system/        # 系统管理 (配置、敏感词、操作日志)
│   └── merchant-portal/  # 商家后台 (独立登录、仪表盘、店铺、消息、设置)
├── theme/             # 主题配置
├── styles/            # 样式变量
└── utils/             # 工具函数 (request, format, export)

backend/src/
├── config/            # 配置文件
├── controller/        # 控制器
├── entity/            # 实体
├── middleware/         # 中间件
├── service/           # 服务层
├── configuration.ts   # 应用配置
└── index.ts           # 入口文件
```

## 双后台架构

1. **管理后台** (`/`) — 平台管理员使用，token 存储在 `localStorage.token`
2. **商家后台** (`/merchant-portal/`) — 商家使用，token 存储在 `localStorage.merchant_token`

## 开发命令

### 前端 (admin)
```bash
npm run dev      # 启动开发服务器 (端口 5174)
npm run build    # TypeScript 编译 + 构建
npm run preview  # 预览构建产物
```

### 后端 (backend)
```bash
npm run dev      # 启动开发服务器
npm run build    # 构建
npm start        # 启动生产服务器
npm test         # 运行测试 (需安装 jest)
```

## Git 分支

- 主分支: `master`
- 当前开发分支: `develop`
- git协作：基于`develop`分支进行开发，完成相关开发后推送自己的分支（如`yxy-dev-01`）到远程，后进行`pull request`，目标：`yxy-dev-01 --> develop`
