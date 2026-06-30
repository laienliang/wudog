# 用户认证系统 — 设计文档

> 日期：2026-06-25
> 项目：乌东文旅"衣食住行"综合服务平台
> 状态：设计完成，待实施

---

## 1. 需求概述

基于需求规格说明书 5.1 节，实现三端统一的用户认证系统。

| 项目 | 内容 |
|------|------|
| 注册方式 | 手机号 + 短信验证码 |
| 登录方式 | ① 手机号+密码 ② 手机号+验证码 ③ 微信授权登录 |
| 密码规则 | 8-20 位，至少含字母与数字 |
| 账号唯一性 | 同一手机号/微信号仅能注册一个账号 |
| 覆盖端 | 微信小程序 + PC 网页端 + 管理后台 |

---

## 2. 技术选型

| 项目 | 选择 |
|------|------|
| JWT 算法 | HS256（对称密钥） |
| 密码加密 | bcrypt cost=12 |
| Access Token 有效期 | 7 天 |
| Refresh Token 有效期 | 30 天 |
| 验证码有效期 | 5 分钟 |
| 验证码重发间隔 | 60 秒 |
| Token 黑名单 | Redis |

---

## 3. 整体架构

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  小程序端     │     │  PC 网页端   │     │  管理后台     │
│ 微信登录/手机  │     │  密码/验证码  │     │  账号密码     │
└──────┬──────┘     └──────┬──────┘     └──────┬───────┘
       │                   │                   │
       └──────────────┬────┘───────────────────┘
                      │ HTTPS / JSON
              ┌───────▼────────┐
              │   /api/v1/auth │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │   JWT 中间件    │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │   各模块 API    │
              └────────────────┘
```

## 4. 认证流程

### 4.1 注册流程

```
用户输入手机号 → 获取验证码(Redis/t_md_sms_code) → 填写验证码
→ 设置密码(8-20位含字母数字) → 服务端创建账号(bcrypt) → 返回Token
```

### 4.2 登录流程

```
├─ 密码登录: 手机号 + 密码 → bcrypt verify → 生成 Token
├─ 验证码登录: 手机号 + 验证码 → Redis 校验 → 生成 Token
└─ 微信登录: wx.code → openid → 查找/绑定 → 生成 Token
```

### 4.3 Token 机制

```
登录成功:
  → Access Token (7天) + Refresh Token (30天)
  → Refresh Token 携带标识 ID 存入 Redis

Token 刷新:
  → 客户端发 Refresh Token → 验证有效期 + Redis 存在
  → 生成新的 Token 对（旧 Refresh Token 作废）

退出登录:
  → Access Token 加入 Redis 黑名单（剩余有效期）
  → Refresh Token 从 Redis 删除
```

---

## 5. API 接口

| 方法 | 端点 | 请求体 | 响应 |
|------|------|--------|------|
| POST | `/api/v1/auth/register` | `{phone, code, password}` | `{accessToken, refreshToken}` |
| POST | `/api/v1/auth/send-code` | `{phone}` | `{expireIn: 300}` |
| POST | `/api/v1/auth/login` | `{phone, password}` | `{accessToken, refreshToken}` |
| POST | `/api/v1/auth/sms-login` | `{phone, code}` | `{accessToken, refreshToken}` |
| POST | `/api/v1/auth/wx-login` | `{code, phone?}` | `{accessToken, refreshToken}` |
| POST | `/api/v1/auth/refresh` | `{refreshToken}` | `{accessToken, refreshToken}` |
| POST | `/api/v1/auth/logout` | — | `{success: true}` |
| GET | `/api/v1/auth/profile` | — | `{user}` |
| PUT | `/api/v1/auth/profile` | `{nickname, avatar}` | `{user}` |

---

## 6. 数据模型

### 6.1 wd_user（已有表，无需修改）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| openid | VARCHAR(100) | 微信 openid |
| unionid | VARCHAR(100) | 微信 unionid |
| phone | VARCHAR(20) | 手机号 |
| nickname | VARCHAR(100) | 昵称 |
| avatar | VARCHAR(500) | 头像 |
| gender | TINYINT | 性别 |
| password | VARCHAR(255) | bcrypt 哈希 |
| last_login_at | DATETIME | 最后登录时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| deleted_at | DATETIME | 软删除 |

### 6.2 新增表：验证码表

```sql
CREATE TABLE `wd_sms_code` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone`      VARCHAR(20) NOT NULL COMMENT '手机号',
  `code`       VARCHAR(6) NOT NULL COMMENT '验证码',
  `used`       TINYINT DEFAULT 0 COMMENT '是否已使用',
  `expire_at`  DATETIME NOT NULL COMMENT '过期时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信验证码';
```

---

## 7. 目录结构（新增文件）

```
packages/server/src/modules/auth/
├── controller/
│   └── auth.controller.ts      # 认证路由
├── service/
│   ├── auth.service.ts          # 认证业务逻辑
│   └── sms.service.ts           # 验证码服务
├── entity/
│   └── sms-code.entity.ts       # 验证码实体
├── dto/
│   ├── register.dto.ts          # 注册 DTO
│   ├── login.dto.ts             # 登录 DTO
│   ├── send-code.dto.ts         # 发送验证码 DTO
│   └── update-profile.dto.ts    # 更新资料 DTO
├── interface/
│   └── auth.interface.ts        # 类型定义
└── middleware/
    └── auth.middleware.ts       # 更新现有的 JWT 中间件
```

---

## 8. 错误码

| code | 场景 |
|------|------|
| 200 | 成功 |
| 400 | 参数格式错误 |
| 401 | Token 过期/无效 |
| 409 | 手机号已注册/微信已绑定 |
| 422 | 验证码错误/过期、密码错误 |
| 429 | 发送验证码太频繁 |

---

## 9. 安全策略

- 密码 bcrypt 加密（cost=12）
- 验证码 6 位纯数字，5 分钟过期
- 同一手机号 60 秒内不可重发验证码
- Token 黑名单机制（Redis）
- 手机号中间 4 位脱敏展示
- 登录错误 5 次后临时锁定 15 分钟
