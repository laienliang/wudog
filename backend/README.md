# 乌东文旅平台 - 住宿预订 / 苗寨民宿搜索 后端服务

> 技术栈：Midway.js (Node.js) + TypeORM + MySQL，运行端口 3000

## 目录结构

```
backend/
├── sql/
│   └── init.sql              # 数据库建表脚本（含示例数据）
├── src/
│   ├── bootstrap.ts          # 应用入口
│   ├── configuration.ts      # 应用配置（组件装配）
│   ├── config.default.ts     # 默认配置（数据库/端口/CORS）
│   ├── interfaces.ts         # 统一接口类型定义
│   ├── utils/
│   │   └── response.ts       # 统一响应/分页工具函数
│   ├── entity/               # TypeORM 实体定义
│   │   ├── base.entity.ts    # 实体基类（公共字段）
│   │   ├── user.entity.ts
│   │   ├── miao-village.entity.ts
│   │   ├── accommodation.entity.ts
│   │   ├── room.entity.ts
│   │   ├── order.entity.ts
│   │   └── review.entity.ts
│   ├── service/              # 业务逻辑层
│   │   ├── user.service.ts
│   │   ├── miao-village.service.ts
│   │   ├── accommodation.service.ts
│   │   ├── room.service.ts
│   │   ├── order.service.ts
│   │   └── review.service.ts
│   └── controller/           # 路由与入参校验
│       ├── user.controller.ts
│       ├── miao-village.controller.ts
│       ├── accommodation.controller.ts
│       ├── room.controller.ts
│       ├── order.controller.ts
│       └── review.controller.ts
├── package.json
└── tsconfig.json
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 初始化数据库

1. 本地启动 MySQL（5.7+ / 8.0 均可）
2. 执行建表脚本：

```bash
mysql -u root -p < sql/init.sql
```

脚本会自动创建 `wudong_tourism` 数据库、6 张数据表，并写入示例数据。

### 3. 修改数据库配置

编辑 `src/config.default.ts` 中的 `typeorm.dataSource.default`，按本地 MySQL 实际情况修改：

```typescript
host: '127.0.0.1',
port: 3306,
username: 'root',
password: 'root',
database: 'wudong_tourism',
```

### 4. 启动服务

```bash
npm run dev
```

启动成功后控制台输出：

```
[wudong-tourism] 服务已启动: http://localhost:3000
[wudong-tourism] 应用就绪
```

## 接口规范

### 统一响应格式

```json
// 成功
{ "code": 200, "message": "success", "data": { ... } }

// 失败
{ "code": 400, "message": "参数错误", "data": null }
```

### 分页

- 请求参数：`?page=1&pageSize=20`
- 响应结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "list": [ ... ]
  }
}
```

### REST 路径风格

全小写 + 连字符，动作后缀：`/api/{entity}/list`、`/api/{entity}/detail/:id`、`/api/{entity}/create`、`/api/{entity}/update/:id`、`/api/{entity}/delete/:id`

## 核心数据表

| 表名            | 说明       | 公共字段                                   |
| --------------- | ---------- | ------------------------------------------ |
| user            | 用户表     | id / created_at / updated_at / is_deleted  |
| miao_village    | 苗寨/景区表 | 同上                                       |
| accommodation   | 住宿/民宿表 | 同上                                       |
| room            | 房型表     | 同上                                       |
| order           | 预订订单表 | 同上                                       |
| review          | 评价表     | 同上                                       |

## 6 大核心模块接口清单

每个模块均实现：列表(分页)、详情、新增、更新、软删除 共 5 个接口。

### 1. 用户 user

| 方法 | 路径                       | 说明         |
| ---- | -------------------------- | ------------ |
| GET  | /api/user/list             | 用户列表     |
| GET  | /api/user/detail/:id       | 用户详情     |
| POST | /api/user/create           | 新增用户     |
| PUT  | /api/user/update/:id       | 更新用户     |
| DEL  | /api/user/delete/:id       | 软删除用户   |

### 2. 苗寨 miao-village

| 方法 | 路径                              | 说明         |
| ---- | --------------------------------- | ------------ |
| GET  | /api/miao-village/list            | 苗寨列表     |
| GET  | /api/miao-village/detail/:id      | 苗寨详情     |
| POST | /api/miao-village/create          | 新增苗寨     |
| PUT  | /api/miao-village/update/:id      | 更新苗寨     |
| DEL  | /api/miao-village/delete/:id      | 软删除苗寨   |

### 3. 住宿 accommodation

| 方法 | 路径                                 | 说明                          |
| ---- | ------------------------------------ | ----------------------------- |
| GET  | /api/accommodation/list              | 住宿列表（支持搜索/筛选）     |
| GET  | /api/accommodation/detail/:id        | 住宿详情                      |
| POST | /api/accommodation/create            | 新增住宿                      |
| PUT  | /api/accommodation/update/:id        | 更新住宿                      |
| DEL  | /api/accommodation/delete/:id        | 软删除住宿                    |

### 4. 房型 room

| 方法 | 路径                       | 说明         |
| ---- | -------------------------- | ------------ |
| GET  | /api/room/list             | 房型列表     |
| GET  | /api/room/detail/:id       | 房型详情     |
| POST | /api/room/create           | 新增房型     |
| PUT  | /api/room/update/:id       | 更新房型     |
| DEL  | /api/room/delete/:id       | 软删除房型   |

### 5. 订单 order

| 方法 | 路径                       | 说明         |
| ---- | -------------------------- | ------------ |
| GET  | /api/order/list            | 订单列表     |
| GET  | /api/order/detail/:id      | 订单详情     |
| POST | /api/order/create          | 创建预订订单 |
| PUT  | /api/order/update/:id      | 更新订单     |
| DEL  | /api/order/delete/:id      | 软删除订单   |

### 6. 评价 review

| 方法 | 路径                       | 说明         |
| ---- | -------------------------- | ------------ |
| GET  | /api/review/list           | 评价列表     |
| GET  | /api/review/detail/:id     | 评价详情     |
| POST | /api/review/create         | 新增评价     |
| PUT  | /api/review/update/:id     | 更新评价     |
| DEL  | /api/review/delete/:id     | 软删除评价   |

详细的 curl 联调命令见 `docs/api-test.md`。
