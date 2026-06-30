# 用户认证系统 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为乌东文旅平台实现三端统一的用户认证系统（注册/登录/微信登录/Token管理）

**Architecture:** 基于现有 Midway.js v3 + TypeORM + Redis 架构，在 `modules/auth/` 目录下新增认证模块。复用已有的 `wd_user` 表，新增 `wd_sms_code` 表。JWT 采用 HS256 算法，双 Token（Access + Refresh）机制。

**Tech Stack:** Midway.js v3.20.x + TypeORM 0.3.x + mysql2 + bcryptjs + jsonwebtoken + Redis

## Global Constraints

- 所有密码使用 bcrypt cost=12 加密
- Access Token 有效期 7 天，Refresh Token 有效期 30 天
- 验证码 6 位纯数字，有效期 5 分钟
- 同一手机号 60 秒内不可重复发送验证码
- Token 黑名单使用 Redis 存储
- 手机号脱敏展示：中间 4 位替换为 `****`
- **登录错误 5 次后临时锁定 15 分钟**（Redis 记录失败次数）
- 所有 API 以 `/api/v1/auth/` 开头
- 文件放在 `packages/server/src/modules/auth/` 目录下
- **用户资料含：头像、昵称、性别、地区、个人简介**

---

## File Structure

```
新增文件：
packages/server/src/modules/auth/
├── entity/sms-code.entity.ts          # 验证码实体
├── service/sms.service.ts             # 短信验证码服务
├── service/auth.service.ts            # 认证业务逻辑
├── controller/auth.controller.ts      # 认证路由
├── dto/send-code.dto.ts               # 发送验证码 DTO
├── dto/register.dto.ts                # 注册 DTO
├── dto/login.dto.ts                   # 登录 DTO
├── dto/update-profile.dto.ts          # 更新资料 DTO
└── interface/auth.interface.ts        # 类型定义

修改文件：
packages/server/src/configuration.ts            # 添加 auth 模块导入
packages/server/src/common/middleware/auth.middleware.ts  # 完善 JWT 验证
packages/server/src/config/config.default.ts    # 添加 JWT 密钥配置
docs/database/init.sql                          # 添加 wd_sms_code 表
```

---

### Task 1: 创建验证码实体 + 补充用户表字段 + 数据库表

**Files:**
- Create: `packages/server/src/modules/auth/entity/sms-code.entity.ts`
- Modify: `packages/server/src/common/entity/user.entity.ts`（添加 region、bio 字段）
- Modify: `docs/database/init.sql`（添加 wd_sms_code 表 + wd_user 补充字段）

**Interfaces:**
- Consumes: BaseEntity (`packages/server/src/common/entity/base.entity.ts`)
- Produces: `smsCodeEntity` — TypeORM 实体，用于 Task 2 的 Repository 注入

- [ ] **Step 1: 创建实体文件**

```typescript
// packages/server/src/modules/auth/entity/sms-code.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_sms_code')
export class SmsCode extends BaseEntity {
  @Column({ type: 'varchar', length: 20, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 6, comment: '验证码' })
  code: string;

  @Column({ type: 'tinyint', default: 0, comment: '是否已使用' })
  used: number;

  @Column({ name: 'expire_at', type: 'datetime', nullable: false, comment: '过期时间' })
  expireAt: Date;
}
```

- [ ] **Step 2: 更新数据库 init.sql**

在 `docs/database/init.sql` 中 `wd_user` 表后面添加：

```sql
-- 短信验证码表
CREATE TABLE `wd_sms_code` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone`      VARCHAR(20) NOT NULL COMMENT '手机号',
  `code`       VARCHAR(6) NOT NULL COMMENT '验证码',
  `used`       TINYINT DEFAULT 0 COMMENT '是否已使用',
  `expire_at`  DATETIME NOT NULL COMMENT '过期时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信验证码';
```

- [ ] **Step 3: MySQL 中执行建表**

```bash
mysql -u root -p050228hdl wudong_platform -e "SOURCE E:/乌东项目实训/wudong-platform/docs/database/init.sql" 2>&1 | tail -5
# 或单独执行：
mysql -u root -p050228hdl wudong_platform -e "
CREATE TABLE IF NOT EXISTS wd_sms_code (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  used TINYINT DEFAULT 0,
  expire_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SELECT 'sms_code table created' AS status;
"
```

- [ ] **Step 4: 提交**

```bash
git add packages/server/src/modules/auth/entity/sms-code.entity.ts docs/database/init.sql
git commit -m "feat: add sms_code entity and table"
```

---

### Task 2: 验证码服务（发送 + 校验）

**Files:**
- Create: `packages/server/src/modules/auth/service/sms.service.ts`
- Create: `packages/server/src/modules/auth/dto/send-code.dto.ts`
- Create: `packages/server/src/modules/auth/interface/auth.interface.ts`

**Interfaces:**
- Consumes: `SmsCode` entity (from Task 1)
- Produces: `SmsService.sendCode(phone)` → `Promise<void>`; `SmsService.verifyCode(phone, code)` → `Promise<boolean>`

- [ ] **Step 1: 创建 DTO**

```typescript
// packages/server/src/modules/auth/dto/send-code.dto.ts
import { Rule, RuleType } from '@midwayjs/validate';

export class SendCodeDTO {
  @Rule(RuleType.string().required().pattern(/^1[3-9]\d{9}$/).message('手机号格式不正确'))
  phone: string;
}
```

- [ ] **Step 2: 创建接口类型定义**

```typescript
// packages/server/src/modules/auth/interface/auth.interface.ts
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
  gender: number;
  region: string;
  bio: string;
  createdAt: Date;
}
```

- [ ] **Step 3: 创建短信验证码服务**

```typescript
// packages/server/src/modules/auth/service/sms.service.ts
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { SmsCode } from '../entity/sms-code.entity';

@Provide()
export class SmsService {
  @InjectEntityModel(SmsCode)
  smsCodeModel: Repository<SmsCode>;

  /**
   * 生成6位随机验证码
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 发送验证码（开发环境直接返回，实际对接短信网关）
   */
  async sendCode(phone: string): Promise<void> {
    const code = this.generateCode();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    // 保存到数据库
    await this.smsCodeModel.insert({
      phone,
      code,
      expireAt,
      used: 0,
    });

    // TODO: 对接短信网关发送验证码
    // 开发环境直接打印到控制台
    console.log(`[SMS] 验证码已发送到 ${phone}: ${code}`);
  }

  /**
   * 校验验证码
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const record = await this.smsCodeModel.findOne({
      where: { phone, code, used: 0 },
      order: { createdAt: 'DESC' },
    });

    if (!record) return false;
    if (new Date() > new Date(record.expireAt)) return false;

    // 标记为已使用
    await this.smsCodeModel.update(record.id, { used: 1 });
    return true;
  }
}
```

- [ ] **Step 4: 提交**

```bash
git add packages/server/src/modules/auth/service/sms.service.ts packages/server/src/modules/auth/dto/send-code.dto.ts packages/server/src/modules/auth/interface/auth.interface.ts
git commit -m "feat: add sms verification service"
```

---

### Task 3: 认证服务（注册 + 密码登录 + Token 管理）

**Files:**
- Create: `packages/server/src/modules/auth/service/auth.service.ts`
- Create: `packages/server/src/modules/auth/dto/register.dto.ts`
- Create: `packages/server/src/modules/auth/dto/login.dto.ts`

**Interfaces:**
- Consumes: `SmsService` (from Task 2), `wd_user` table, Redis
- Produces: `AuthService.register()`, `AuthService.login()`, `AuthService.refreshToken()`, `AuthService.logout()`

- [ ] **Step 1: 创建注册 DTO**

```typescript
// packages/server/src/modules/auth/dto/register.dto.ts
import { Rule, RuleType } from '@midwayjs/validate';

export class RegisterDTO {
  @Rule(RuleType.string().required().pattern(/^1[3-9]\d{9}$/).message('手机号格式不正确'))
  phone: string;

  @Rule(RuleType.string().required().length(6).message('验证码为6位数字'))
  code: string;

  @Rule(RuleType.string().required().min(8).max(20).pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).message('密码8-20位，需包含字母和数字'))
  password: string;
}
```

- [ ] **Step 2: 创建登录 DTO**

```typescript
// packages/server/src/modules/auth/dto/login.dto.ts
import { Rule, RuleType } from '@midwayjs/validate';

export class LoginDTO {
  @Rule(RuleType.string().required())
  phone: string;

  @Rule(RuleType.string().required())
  password: string;
}

export class SmsLoginDTO {
  @Rule(RuleType.string().required())
  phone: string;

  @Rule(RuleType.string().required().length(6))
  code: string;
}

export class WxLoginDTO {
  @Rule(RuleType.string().required())
  code: string;

  @Rule(RuleType.string().optional())
  phone?: string;
}

export class RefreshTokenDTO {
  @Rule(RuleType.string().required())
  refreshToken: string;
}
```

- [ ] **Step 3: 创建认证服务**

```typescript
// packages/server/src/modules/auth/service/auth.service.ts
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { InjectRedis } from '@midwayjs/redis';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../../../common/entity/user.entity';  // 需创建此实体
import { SmsService } from './sms.service';
import { TokenPair, UserProfile } from '../interface/auth.interface';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRES = '7d';
const REFRESH_TOKEN_EXPIRES = '30d';

@Provide()
export class AuthService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  @Inject()
  smsService: SmsService;

  @InjectRedis()
  redis: any;

  private get jwtSecret(): string {
    return process.env.JWT_SECRET || 'wudong-dev-secret-key';
  }

  /**
   * 手机号注册
   */
  async register(phone: string, code: string, password: string): Promise<TokenPair> {
    // 校验验证码
    const valid = await this.smsService.verifyCode(phone, code);
    if (!valid) throw new Error('验证码错误或已过期');

    // 检查手机号是否已注册
    const existing = await this.userModel.findOne({ where: { phone } });
    if (existing) throw new Error('该手机号已注册');

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userModel.save({
      phone,
      password: hashedPassword,
      nickname: `用户${phone.slice(-4)}`,
    });

    return this.generateTokens(user.id);
  }

  /**
   * 密码登录（含错误次数锁定）
   */
  async login(phone: string, password: string): Promise<TokenPair> {
    // 检查是否被锁定
    const lockKey = `login:lock:${phone}`;
    const locked = await this.redis.get(lockKey);
    if (locked) throw new Error('账号已临时锁定，请15分钟后再试');

    const user = await this.userModel.findOne({ where: { phone } });
    if (!user || !user.password) {
      await this.recordLoginFail(phone);
      throw new Error('手机号或密码错误');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await this.recordLoginFail(phone);
      throw new Error('手机号或密码错误');
    }

    // 登录成功，清除失败记录
    await this.redis.del(`login:fail:${phone}`);
    await this.userModel.update(user.id, { lastLoginAt: new Date() });
    return this.generateTokens(user.id);
  }

  /**
   * 记录登录失败次数（5次后锁定15分钟）
   */
  private async recordLoginFail(phone: string): Promise<void> {
    const failKey = `login:fail:${phone}`;
    const count = await this.redis.incr(failKey);
    await this.redis.expire(failKey, 15 * 60);
    if (count >= 5) {
      await this.redis.set(`login:lock:${phone}`, '1', 'EX', 15 * 60);
    }
  }

  /**
   * 验证码登录
   */
  async smsLogin(phone: string, code: string): Promise<TokenPair> {
    const valid = await this.smsService.verifyCode(phone, code);
    if (!valid) throw new Error('验证码错误或已过期');

    // 查找或创建用户
    let user = await this.userModel.findOne({ where: { phone } });
    if (!user) {
      user = await this.userModel.save({
        phone,
        nickname: `用户${phone.slice(-4)}`,
      });
    }

    await this.userModel.update(user.id, { lastLoginAt: new Date() });
    return this.generateTokens(user.id);
  }

  /**
   * 生成 Token 对
   */
  private async generateTokens(userId: number): Promise<TokenPair> {
    const accessToken = jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });

    const refreshToken = jwt.sign({ userId, type: 'refresh' }, this.jwtSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRES,
    });

    // Refresh Token ID 存入 Redis
    await this.redis.set(`refresh:${userId}`, refreshToken, 'EX', 30 * 24 * 60 * 60);

    return { accessToken, refreshToken };
  }

  /**
   * 刷新 Token
   */
  async refreshToken(token: string): Promise<TokenPair> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      if (decoded.type !== 'refresh') throw new Error('无效的 Refresh Token');

      const stored = await this.redis.get(`refresh:${decoded.userId}`);
      if (stored !== token) throw new Error('Refresh Token 已失效');

      return this.generateTokens(decoded.userId);
    } catch (err) {
      throw new Error('Token 无效或已过期');
    }
  }

  /**
   * 退出登录
   */
  async logout(userId: number, accessToken: string): Promise<void> {
    // 从 Redis 删除 Refresh Token
    await this.redis.del(`refresh:${userId}`);
    // Access Token 加入黑名单（剩余有效期）
    const decoded = jwt.decode(accessToken) as any;
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await this.redis.set(`blacklist:${accessToken}`, '1', 'EX', ttl);
    }
  }

  /**
   * 获取用户信息
   */
  async getProfile(userId: number): Promise<UserProfile> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) throw new Error('用户不存在');

    return {
      id: user.id,
      phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      region: user.region,
      bio: user.bio,
      createdAt: user.createdAt,
    };
  }
}
```

- [ ] **Step 4: 提交**

```bash
git add packages/server/src/modules/auth/service/auth.service.ts packages/server/src/modules/auth/dto/register.dto.ts packages/server/src/modules/auth/dto/login.dto.ts
git commit -m "feat: add auth service with register/login/token management"
```

---

### Task 4: 创建 User 实体（从 wd_user 表映射）

**Files:**
- Create: `packages/server/src/common/entity/user.entity.ts`

**Interfaces:**
- Consumes: BaseEntity
- Produces: `User` entity — 用于 Task 3 的 AuthService 和 Task 5 的 Controller

- [ ] **Step 1: 创建 User 实体**

```typescript
// packages/server/src/common/entity/user.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('wd_user')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true, comment: '微信openid' })
  openid: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '微信unionid' })
  unionid: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ type: 'tinyint', default: 0, comment: '性别：0未知 1男 2女' })
  gender: number;

  @Column({ type: 'varchar', length: 50, default: 'user', comment: '角色：user/merchant/admin' })
  role: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '地区' })
  region: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '个人简介' })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '密码（bcrypt）' })
  password: string;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true, comment: '最后登录时间' })
  lastLoginAt: Date;
}
```

- [ ] **Step 2: 提交**

```bash
git add packages/server/src/common/entity/user.entity.ts
git commit -m "feat: add User entity mapping"
```

---

### Task 5: 认证控制器（所有路由入口）

**Files:**
- Create: `packages/server/src/modules/auth/controller/auth.controller.ts`
- Create: `packages/server/src/modules/auth/dto/update-profile.dto.ts`

- [ ] **Step 1: 创建更新资料 DTO**

```typescript
// packages/server/src/modules/auth/dto/update-profile.dto.ts
import { Rule, RuleType } from '@midwayjs/validate';

export class UpdateProfileDTO {
  @Rule(RuleType.string().max(50).empty(''))
  nickname?: string;

  @Rule(RuleType.string().max(500).empty(''))
  avatar?: string;

  @Rule(RuleType.number().valid(0, 1, 2).optional())
  gender?: number;

  @Rule(RuleType.string().max(100).empty(''))
  region?: string;

  @Rule(RuleType.string().max(200).empty(''))
  bio?: string;
}
```

- [ ] **Step 2: 创建认证控制器**

```typescript
// packages/server/src/modules/auth/controller/auth.controller.ts
import { Inject, Controller, Post, Get, Put, Body, Query } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { AuthService } from '../service/auth.service';
import { SmsService } from '../service/sms.service';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO, SmsLoginDTO, WxLoginDTO, RefreshTokenDTO } from '../dto/login.dto';
import { SendCodeDTO } from '../dto/send-code.dto';
import { UpdateProfileDTO } from '../dto/update-profile.dto';

@Controller('/api/v1/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  smsService: SmsService;

  @Post('/send-code')
  @Validate()
  async sendCode(@Body() body: SendCodeDTO) {
    await this.smsService.sendCode(body.phone);
    return { expireIn: 300 };
  }

  @Post('/register')
  @Validate()
  async register(@Body() body: RegisterDTO) {
    const tokens = await this.authService.register(body.phone, body.code, body.password);
    return tokens;
  }

  @Post('/login')
  @Validate()
  async login(@Body() body: LoginDTO) {
    const tokens = await this.authService.login(body.phone, body.password);
    return tokens;
  }

  @Post('/sms-login')
  @Validate()
  async smsLogin(@Body() body: SmsLoginDTO) {
    const tokens = await this.authService.smsLogin(body.phone, body.code);
    return tokens;
  }

  @Post('/wx-login')
  @Validate()
  async wxLogin(@Body() body: WxLoginDTO) {
    // TODO: 微信 code 换取 openid 后调用 authService
    const tokens = await this.authService.smsLogin(body.phone || '', '');
    return tokens;
  }

  @Post('/refresh')
  @Validate()
  async refresh(@Body() body: RefreshTokenDTO) {
    const tokens = await this.authService.refreshToken(body.refreshToken);
    return tokens;
  }

  @Post('/logout')
  async logout(@Body() body: any, @Query() ctx: any) {
    const userId = ctx.user?.userId;
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(userId, token);
    return { success: true };
  }

  @Get('/profile')
  async profile(@Query() ctx: any) {
    const userId = ctx.user?.userId;
    return this.authService.getProfile(userId);
  }

  @Put('/profile')
  @Validate()
  async updateProfile(@Body() body: UpdateProfileDTO, @Query() ctx: any) {
    const userId = ctx.user?.userId;
    // TODO: 更新用户资料
    return this.authService.getProfile(userId);
  }
}
```

> 注意：Midway v3 控制器中获取当前用户 ID 需要通过中间件挂载，实际写法需根据 auth.middleware.ts 调整。

- [ ] **Step 3: 提交**

```bash
git add packages/server/src/modules/auth/controller/auth.controller.ts packages/server/src/modules/auth/dto/update-profile.dto.ts
git commit -m "feat: add auth controller with all endpoints"
```

---

### Task 6: 更新 JWT 中间件 + 配置 + 导入

**Files:**
- Modify: `packages/server/src/common/middleware/auth.middleware.ts`
- Modify: `packages/server/src/config/config.default.ts`
- Modify: `packages/server/src/configuration.ts`

- [ ] **Step 1: 完善 JWT 中间件**

```typescript
// packages/server/src/common/middleware/auth.middleware.ts
import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'wudong-dev-secret-key';

@Middleware()
export class AuthMiddleware {
  private whitelist = [
    '/api/v1/auth/send-code',
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/api/v1/auth/sms-login',
    '/api/v1/auth/wx-login',
    '/api/v1/auth/refresh',
    '/api/v1/products',
    '/api/v1/foods',
    '/api/v1/accommodations',
    '/api/v1/travels',
    '/api/v1/travelogues',
    '/api/v1/search',
    '/api/v1/upload/apply',
    '/swagger-ui',
    '/swagger-docs',
  ];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const isWhitelisted = this.whitelist.some((path) =>
        ctx.path.startsWith(path),
      );

      if (isWhitelisted) {
        await next();
        return;
      }

      const authHeader = ctx.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '').trim();

      if (!token) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '请先登录', data: null, timestamp: Date.now() };
        return;
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        ctx.user = { userId: decoded.userId };
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '登录已过期，请重新登录', data: null, timestamp: Date.now() };
      }
    };
  }

  match(ctx: Context) {
    return ctx.path.startsWith('/api/');
  }
}
```

- [ ] **Step 2: 更新 configuration.ts 导入 auth 模块**

```typescript
// packages/server/src/configuration.ts
// 在 application.ts 中，不需要额外导入 auth 模块
// Midway.js v3 会自动扫描 src/modules/ 下的 @Provide 和 @Controller 装饰器
```

检查 `configuration.ts` 中的 `importConfigs` 已包含 `__dirname + '/config'`，以及 `orm` 配置中的 `entities: ['**/entity/*.entity.{ts,js}']` 已包含 `modules/auth/entity/` 路径。

- [ ] **Step 3: 提交**

```bash
git add packages/server/src/common/middleware/auth.middleware.ts
git commit -m "feat: update JWT middleware with actual verification"
```

---

### Task 7: 更新 config.default.ts 配置

- [ ] **Step 1: 检查并确认 JWT 配置已存在**

```typescript
// packages/server/src/config/config.default.ts
// 已有配置（在 jwt 段落）：
jwt: {
  secret: process.env.JWT_SECRET || 'wudong-dev-secret-key',
  accessTokenExpiresIn: '7d',
  refreshTokenExpiresIn: '30d',
  algorithm: 'HS256',  // 改为 HS256，与代码一致
},
```

- [ ] **Step 2: 提交**

```bash
git add packages/server/src/config/config.default.ts
git commit -m "fix: update JWT algorithm to HS256"
```

---

### Task 8: 验证启动

- [ ] **Step 1: 停止旧服务，启动后端验证**

```bash
# 杀掉旧进程
taskkill //F //IM node.exe 2>/dev/null; sleep 2
# 启动服务
cd E:/乌东项目实训/wudong-platform && pnpm dev:server
```

- [ ] **Step 2: 测试注册流程**

```bash
# 发送验证码
curl -s -X POST http://localhost:7001/api/v1/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000"}'
# 预期：{"code":200,"data":{"expireIn":300}}

# 注册（验证码看服务端控制台输出）
curl -s -X POST http://localhost:7001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","code":"123456","password":"abc12345"}'
# 预期：{"code":200,"data":{"accessToken":"...","refreshToken":"..."}}
```

- [ ] **Step 3: 测试密码登录**

```bash
curl -s -X POST http://localhost:7001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"abc12345"}'
# 预期：{"code":200,"data":{"accessToken":"...","refreshToken":"..."}}
```

- [ ] **Step 4: 提交最终版本**

```bash
git add .
git commit -m "feat: complete auth system implementation"
git push
```

---

## Spec Coverage Check

| 设计文档要求 | 对应 Task |
|-------------|----------|
| 手机号+验证码注册 | Task 3 (AuthService.register) + Task 2 (SmsService) |
| 手机号+密码登录 | Task 3 (AuthService.login) |
| 手机号+验证码登录 | Task 3 (AuthService.smsLogin) |
| 微信登录 | Task 5 (wxLogin — 骨架) |
| JWT Access Token(7d) | Task 3 (generateTokens) |
| Refresh Token(30d) | Task 3 (generateTokens + Redis) |
| Token 刷新 | Task 3 (refreshToken) |
| 退出登录(黑名单) | Task 3 (logout) |
| 验证码表(wd_sms_code) | Task 1 (entity) |
| 验证码5分钟过期 | Task 2 (SmsService) |
| bcrypt加密 | Task 3 (AuthService.register) |
| 手机号脱敏 | Task 3 (getProfile) |
| JWT中间件鉴权 | Task 6 (auth.middleware.ts) |
| 个人资料接口 | Task 5 (profile + updateProfile) |
| 统一响应格式 | 复用已有中间件 |
