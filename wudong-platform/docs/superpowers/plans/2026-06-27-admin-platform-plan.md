# 平台管理后台实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成模块6平台管理后台，包括管理员鉴权、用户管理、商家入驻、数据看板、首页运营、消息中心、财务结算、全局订单、系统设置 + 商家后台框架

**Architecture:** 后端 Midway.js 分层（entity→service→controller），管理后台 React + Ant Design Pro，ECharts 图表，复用现有布局框架，新增管理员 JWT 鉴权

**Tech Stack:** Midway.js v3, TypeORM, React 18, Ant Design 5.x, ProTable, ECharts, bcrypt, JWT

## Global Constraints

- 后端实体命名 `wd_admin_*` 蛇形表名
- 所有 API 基础路径 `/api/v1`
- 管理后台品牌色 `#1F5FA8`
- 所有业务数据软删除（`deleted_at`）
- 管理员密码 bcrypt cost=12
- JWT Access Token 7天 + Refresh Token 30天（复用已有的 auth.service 双Token机制）
- 操作日志不可删除
- 敏感操作需记录操作日志

---

### Task 1: 管理员后端实体

**Files:**
- Create: `packages/server/src/modules/admin/entity/admin.entity.ts`
- Create: `packages/server/src/modules/admin/entity/role.entity.ts`
- Create: `packages/server/src/modules/admin/entity/merchant.entity.ts`
- Create: `packages/server/src/modules/admin/entity/merchant-application.entity.ts`
- Create: `packages/server/src/modules/admin/entity/banner.entity.ts`
- Create: `packages/server/src/modules/admin/entity/announcement.entity.ts`
- Create: `packages/server/src/modules/admin/entity/recommendation.entity.ts`
- Create: `packages/server/src/modules/admin/entity/system-message.entity.ts`
- Create: `packages/server/src/modules/admin/entity/finance-record.entity.ts`
- Create: `packages/server/src/modules/admin/entity/system-config.entity.ts`
- Create: `packages/server/src/modules/admin/entity/operation-log.entity.ts`
- Create: `packages/server/src/modules/admin/entity/sensitive-word.entity.ts`
- Modify: `packages/server/src/configuration.ts` (注册 admin 实体)

- [ ] **Step 1: 创建 Admin 实体**

```typescript
// packages/server/src/modules/admin/entity/admin.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin')
export class Admin extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 200, comment: 'bcrypt 加密' })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  realName: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ type: 'tinyint', default: 1, comment: '0禁用 1启用' })
  status: number;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date;
}
```

- [ ] **Step 2: 创建 Role 实体**

```typescript
// packages/server/src/modules/admin/entity/role.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_role')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'simple-json', nullable: true, comment: '权限标识列表 ["user:list", "order:edit"]' })
  permissions: string[];
}
```

- [ ] **Step 3: 创建 Merchant 实体**

```typescript
// packages/server/src/modules/admin/entity/merchant.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_merchant')
export class Merchant extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 50, comment: '所属模块 clothing/food/accommodation/travel' })
  module: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'tinyint', default: 0, comment: '0待审核 1已通过 2已驳回 3已封禁' })
  status: number;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date;
}
```

- [ ] **Step 4: 创建 MerchantApplication 实体**

```typescript
// packages/server/src/modules/admin/entity/merchant-application.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_merchant_application')
export class MerchantApplication extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 50, comment: '申请入驻模块' })
  module: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'text', nullable: true, comment: '资质材料 JSON' })
  credentials: string;

  @Column({ type: 'tinyint', default: 0, comment: '0待审核 1已通过 2已驳回' })
  status: number;

  @Column({ name: 'reviewer_id', nullable: true })
  reviewerId: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '驳回原因' })
  rejectReason: string;

  @Column({ name: 'reviewed_at', type: 'datetime', nullable: true })
  reviewedAt: Date;
}
```

- [ ] **Step 5: 创建 Banner / Announcement / Recommendation 运营实体**

```typescript
// packages/server/src/modules/admin/entity/banner.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_banner')
export class Banner extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ name: 'link_url', type: 'varchar', length: 500, nullable: true })
  linkUrl: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1, comment: '0下架 1上架' })
  status: number;
}

// packages/server/src/modules/admin/entity/announcement.entity.ts
@Entity('wd_admin_announcement')
export class Announcement extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'tinyint', default: 1, comment: '0草稿 1已发布' })
  status: number;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date;
}

// packages/server/src/modules/admin/entity/recommendation.entity.ts
@Entity('wd_admin_recommendation')
export class Recommendation extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'content_type', type: 'varchar', length: 50, comment: 'product/restaurant/homestay/route/travelogue' })
  contentType: string;

  @Column({ name: 'content_id' })
  contentId: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1, comment: '0隐藏 1显示' })
  status: number;
}
```

- [ ] **Step 6: 创建 SystemMessage / FinanceRecord / SystemConfig / OperationLog / SensitiveWord 实体**

```typescript
// packages/server/src/modules/admin/entity/system-message.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_system_message')
export class SystemMessage extends BaseEntity {
  @Column({ name: 'user_id', nullable: true, comment: 'null=群发' })
  userId: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'tinyint', default: 0, comment: '0未读 1已读' })
  isRead: number;
}

// packages/server/src/modules/admin/entity/finance-record.entity.ts
@Entity('wd_admin_finance_record')
export class FinanceRecord extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'platform_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number;

  @Column({ name: 'merchant_income', type: 'decimal', precision: 10, scale: 2, default: 0 })
  merchantIncome: number;

  @Column({ type: 'tinyint', default: 0, comment: '0待结算 1已结算 2已到账' })
  status: number;

  @Column({ name: 'settled_at', type: 'datetime', nullable: true })
  settledAt: Date;
}

// packages/server/src/modules/admin/entity/system-config.entity.ts
@Entity('wd_admin_system_config')
export class SystemConfig extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;
}

// packages/server/src/modules/admin/entity/operation-log.entity.ts
@Entity('wd_admin_operation_log')
export class OperationLog extends BaseEntity {
  @Column({ name: 'admin_id' })
  adminId: number;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  target: string;

  @Column({ name: 'target_id', nullable: true })
  targetId: number;

  @Column({ type: 'text', nullable: true, comment: '操作详情' })
  detail: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '操作IP' })
  ip: string;
}

// packages/server/src/modules/admin/entity/sensitive-word.entity.ts
@Entity('wd_admin_sensitive_word')
export class SensitiveWord extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  word: string;

  @Column({ type: 'tinyint', default: 1, comment: '0禁用 1启用' })
  status: number;
}
```

- [ ] **Step 7: 在 configuration.ts 注册 admin 实体**

在 `packages/server/src/configuration.ts` 的 `@Configuration` 装饰器的 `imports` 中添加 admin 模块或实体注册。

---

### Task 2: 管理员服务层 + 控制器

**Files:**
- Create: `packages/server/src/modules/admin/service/admin-auth.service.ts`
- Create: `packages/server/src/modules/admin/service/admin.service.ts`
- Create: `packages/server/src/modules/admin/controller/admin-auth.controller.ts`
- Create: `packages/server/src/modules/admin/controller/admin.controller.ts`
- Modify: `packages/server/src/common/middleware/auth.middleware.ts`

**Interfaces:**
- Consumes: Admin, Role, Merchant, MerchantApplication, Banner, Announcement, Recommendation, SystemMessage, FinanceRecord, SystemConfig, OperationLog, SensitiveWord entities from Task 1
- Produces: AdminAuthService (login/refresh/logout), AdminService (CRUD for all entities)
- Produces: AdminAuthController (/api/v1/admin/auth/*), AdminController (/api/v1/admin/*)

**API 端点总览：**

| 方法 | 路由 | 说明 |
|------|------|------|
| POST | /api/v1/admin/auth/login | 管理员登录 |
| POST | /api/v1/admin/auth/refresh | 刷新Token |
| POST | /api/v1/admin/auth/logout | 退出登录 |
| GET | /api/v1/admin/users | 用户列表（游客） |
| PUT | /api/v1/admin/users/:id/status | 封禁/解封用户 |
| GET | /api/v1/admin/merchants | 商家列表 |
| GET | /api/v1/admin/merchant-applications | 入驻申请列表 |
| POST | /api/v1/admin/merchant-applications/:id/review | 审核入驻申请 |
| GET | /api/v1/admin/roles | 角色列表 |
| POST | /api/v1/admin/roles | 新增角色 |
| PUT | /api/v1/admin/roles/:id | 编辑角色 |
| GET | /api/v1/admin/operation-logs | 操作日志 |
| GET | /api/v1/admin/dashboard | 数据看板 |
| CRUD | /api/v1/admin/banners | 轮播图管理 |
| CRUD | /api/v1/admin/announcements | 公告管理 |
| CRUD | /api/v1/admin/recommendations | 推荐位管理 |
| CRUD | /api/v1/admin/messages | 系统消息 |
| GET/PUT | /api/v1/admin/finance | 财务结算 |
| GET/PUT | /api/v1/admin/config | 系统设置 |
| CRUD | /api/v1/admin/sensitive-words | 敏感词库 |

- [ ] **Step 1: 创建 AdminAuthService**

```typescript
// packages/server/src/modules/admin/service/admin-auth.service.ts
import { Provide, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Admin } from '../entity/admin.entity';

@Provide()
export class AdminAuthService {
  @InjectEntityModel(Admin)
  adminModel: Repository<Admin>;

  @Config('jwt.secret')
  jwtSecret: string;

  async login(username: string, password: string) {
    const admin = await this.adminModel.findOne({ where: { username, deletedAt: undefined } });
    if (!admin) throw new Error('账号或密码错误');
    if (admin.status === 0) throw new Error('账号已被禁用');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error('账号或密码错误');

    const accessToken = jwt.sign({ adminId: admin.id, roleId: admin.roleId, type: 'admin' }, this.jwtSecret, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ adminId: admin.id, type: 'admin_refresh' }, this.jwtSecret, { expiresIn: '30d' });

    await this.adminModel.update(admin.id, { lastLoginAt: new Date() });

    return { accessToken, refreshToken, admin: { id: admin.id, username: admin.username, realName: admin.realName, roleId: admin.roleId } };
  }

  async refresh(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, this.jwtSecret) as { adminId: number; type: string };
    if (decoded.type !== 'admin_refresh') throw new Error('无效的刷新令牌');
    const admin = await this.adminModel.findOne({ where: { id: decoded.adminId } });
    if (!admin || admin.status === 0) throw new Error('账号不可用');
    const accessToken = jwt.sign({ adminId: admin.id, roleId: admin.roleId, type: 'admin' }, this.jwtSecret, { expiresIn: '7d' });
    return { accessToken };
  }
}
```

- [ ] **Step 2: 创建 AdminService（用户管理、商家、运营配置等所有管理服务）**

```typescript
// packages/server/src/modules/admin/service/admin.service.ts
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Admin } from '../entity/admin.entity';
import { Role } from '../entity/role.entity';
import { Merchant } from '../entity/merchant.entity';
import { MerchantApplication } from '../entity/merchant-application.entity';
import { Banner } from '../entity/banner.entity';
import { Announcement } from '../entity/announcement.entity';
import { Recommendation } from '../entity/recommendation.entity';
import { SystemMessage } from '../entity/system-message.entity';
import { FinanceRecord } from '../entity/finance-record.entity';
import { SystemConfig } from '../entity/system-config.entity';
import { OperationLog } from '../entity/operation-log.entity';
import { SensitiveWord } from '../entity/sensitive-word.entity';

@Provide()
export class AdminService {
  @InjectEntityModel(Admin) adminModel: Repository<Admin>;
  @InjectEntityModel(Role) roleModel: Repository<Role>;
  @InjectEntityModel(Merchant) merchantModel: Repository<Merchant>;
  @InjectEntityModel(MerchantApplication) merchantAppModel: Repository<MerchantApplication>;
  @InjectEntityModel(Banner) bannerModel: Repository<Banner>;
  @InjectEntityModel(Announcement) announcementModel: Repository<Announcement>;
  @InjectEntityModel(Recommendation) recommendationModel: Repository<Recommendation>;
  @InjectEntityModel(SystemMessage) messageModel: Repository<SystemMessage>;
  @InjectEntityModel(FinanceRecord) financeModel: Repository<FinanceRecord>;
  @InjectEntityModel(SystemConfig) configModel: Repository<SystemConfig>;
  @InjectEntityModel(OperationLog) logModel: Repository<OperationLog>;
  @InjectEntityModel(SensitiveWord) sensitiveWordModel: Repository<SensitiveWord>;

  // ===== 用户管理（游客） =====
  async listUsers(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    let sql = 'SELECT id, nickname, phone, avatar, status, created_at AS createdAt FROM wd_user WHERE deleted_at IS NULL';
    const params: any[] = [];
    if (keyword) { sql += ' AND (nickname LIKE ? OR phone LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (page - 1) * pageSize);
    const list = await this.adminModel.query(sql, params);
    const countResult = await this.adminModel.query('SELECT COUNT(*) AS total FROM wd_user WHERE deleted_at IS NULL', []);
    return { list, pagination: { page, pageSize, total: Number(countResult[0]?.total || 0), totalPages: Math.ceil((countResult[0]?.total || 0) / pageSize) } };
  }

  async toggleUserStatus(id: number, status: number) {
    await this.adminModel.query('UPDATE wd_user SET status = ? WHERE id = ?', [status, id]);
    return { success: true };
  }

  // ===== 商家管理 =====
  async listMerchants(query: any) {
    const { page = 1, pageSize = 10, status, module } = query;
    const qb = this.merchantModel.createQueryBuilder('m').where('m.deletedAt IS NULL').skip((page - 1) * pageSize).take(pageSize).orderBy('m.createdAt', 'DESC');
    if (status !== undefined) qb.andWhere('m.status = :st', { st: Number(status) });
    if (module) qb.andWhere('m.module = :mod', { mod: module });
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(list.map(async (m: any) => {
      const user = await this.adminModel.query('SELECT nickname, phone FROM wd_user WHERE id = ?', [m.userId]);
      return { ...m, userName: user[0]?.nickname || '-', userPhone: user[0]?.phone || '-' };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  // ===== 入驻审核 =====
  async listApplications(query: any) {
    const { page = 1, pageSize = 10, status } = query;
    const qb = this.merchantAppModel.createQueryBuilder('a').where('a.deletedAt IS NULL').skip((page - 1) * pageSize).take(pageSize).orderBy('a.createdAt', 'DESC');
    if (status !== undefined) qb.andWhere('a.status = :st', { st: Number(status) });
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(list.map(async (a: any) => {
      const user = await this.adminModel.query('SELECT nickname, phone FROM wd_user WHERE id = ?', [a.userId]);
      return { ...a, userName: user[0]?.nickname || '-', userPhone: user[0]?.phone || '-' };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async reviewApplication(id: number, reviewerId: number, status: number, rejectReason?: string) {
    const app = await this.merchantAppModel.findOne({ where: { id } });
    if (!app) throw new Error('申请不存在');

    await this.merchantAppModel.update(id, { status, reviewerId, rejectReason: rejectReason || null, reviewedAt: new Date() });

    if (status === 1) {
      // 通过 — 创建商家账号
      const existing = await this.merchantModel.findOne({ where: { userId: app.userId, module: app.module, deletedAt: undefined } });
      if (!existing) {
        await this.merchantModel.save({
          userId: app.userId, shopName: app.shopName, module: app.module,
          contactPerson: app.contactPerson, contactPhone: app.contactPhone,
          status: 1, approvedAt: new Date(),
        } as any);
      }
    }
    return { success: true };
  }

  // ===== 数据看板 =====
  async getDashboard() {
    const today = new Date().toISOString().slice(0, 10);
    const orderStats = await this.adminModel.query(
      `SELECT COUNT(*) AS total, COALESCE(SUM(pay_amount),0) AS gmv FROM wd_order WHERE deleted_at IS NULL AND status IN ('paid','confirmed','completed')`, []);
    const todayOrders = await this.adminModel.query(
      `SELECT COUNT(*) AS total FROM wd_order WHERE deleted_at IS NULL AND DATE(created_at) = ?`, [today]);
    const userCount = await this.adminModel.query('SELECT COUNT(*) AS total FROM wd_user WHERE deleted_at IS NULL', []);
    const merchantCount = await this.merchantModel.count({ where: { status: 1, deletedAt: undefined } });
    const travelogueCount = await this.adminModel.query('SELECT COUNT(*) AS total FROM wd_community_travelogue WHERE deleted_at IS NULL', []);

    return {
      totalOrders: Number(orderStats[0]?.total || 0),
      totalGMV: Number(orderStats[0]?.gmv || 0),
      todayOrders: Number(todayOrders[0]?.total || 0),
      totalUsers: Number(userCount[0]?.total || 0),
      activeMerchants: merchantCount,
      totalTravelogues: Number(travelogueCount[0]?.total || 0),
    };
  }

  // ===== 轮播图 CRUD =====
  async listBanners() { return this.bannerModel.find({ where: { deletedAt: undefined }, order: { sortOrder: 'ASC' } }); }
  async createBanner(data: any) { return this.bannerModel.save(data); }
  async updateBanner(id: number, data: any) { await this.bannerModel.update(id, data); return this.bannerModel.findOne({ where: { id } }); }
  async deleteBanner(id: number) { return this.bannerModel.softDelete(id); }

  // ===== 公告 CRUD =====
  async listAnnouncements(q: any) {
    const { page = 1, pageSize = 10 } = q;
    const [list, total] = await this.announcementModel.findAndCount({ where: { deletedAt: undefined }, order: { createdAt: 'DESC' }, skip: (page - 1) * pageSize, take: pageSize });
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }
  async createAnnouncement(data: any) { return this.announcementModel.save(data); }
  async updateAnnouncement(id: number, data: any) { await this.announcementModel.update(id, data); return this.announcementModel.findOne({ where: { id } }); }
  async deleteAnnouncement(id: number) { return this.announcementModel.softDelete(id); }

  // ===== 推荐位 CRUD =====
  async listRecommendations() { return this.recommendationModel.find({ where: { deletedAt: undefined }, order: { sortOrder: 'ASC' } }); }
  async createRecommendation(data: any) { return this.recommendationModel.save(data); }
  async updateRecommendation(id: number, data: any) { await this.recommendationModel.update(id, data); return this.recommendationModel.findOne({ where: { id } }); }
  async deleteRecommendation(id: number) { return this.recommendationModel.softDelete(id); }

  // ===== 系统消息 =====
  async listMessages(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const qb = this.messageModel.createQueryBuilder('m').where('m.deletedAt IS NULL').orderBy('m.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }
  async sendMessage(data: any) {
    if (data.userId) {
      return this.messageModel.save(data);
    }
    // 群发：发给所有用户（简化版，仅存一条 userId=null 的记录代表群发）
    return this.messageModel.save({ ...data, userId: null });
  }

  // ===== 财务 =====
  async listFinance(query: any) {
    const { page = 1, pageSize = 10, status } = query;
    const qb = this.financeModel.createQueryBuilder('f').where('f.deletedAt IS NULL').orderBy('f.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    if (status !== undefined) qb.andWhere('f.status = :st', { st: Number(status) });
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(list.map(async (f: any) => {
      const order = await this.adminModel.query('SELECT order_no AS orderNo FROM wd_order WHERE id = ?', [f.orderId]);
      const merchant = await this.merchantModel.findOne({ where: { id: f.merchantId } });
      return { ...f, orderNo: order[0]?.orderNo || '-', shopName: merchant?.shopName || '-' };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  // ===== 系统配置 =====
  async getConfig(key?: string) {
    if (key) return this.configModel.findOne({ where: { key } });
    return this.configModel.find({ where: { deletedAt: undefined } });
  }
  async setConfig(key: string, value: string) {
    const existing = await this.configModel.findOne({ where: { key } });
    if (existing) { await this.configModel.update(existing.id, { value }); return existing; }
    return this.configModel.save({ key, value } as any);
  }

  // ===== 敏感词 =====
  async listSensitiveWords() { return this.sensitiveWordModel.find({ where: { deletedAt: undefined }, order: { createdAt: 'DESC' } }); }
  async createSensitiveWord(data: any) { return this.sensitiveWordModel.save(data); }
  async deleteSensitiveWord(id: number) { return this.sensitiveWordModel.softDelete(id); }

  // ===== 操作日志 =====
  async listOperationLogs(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const qb = this.logModel.createQueryBuilder('l').where('l.deletedAt IS NULL').orderBy('l.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(list.map(async (l: any) => {
      const admin = await this.adminModel.findOne({ where: { id: l.adminId } });
      return { ...l, adminName: admin?.username || '-' };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async logOperation(adminId: number, action: string, target: string, targetId?: number, detail?: string, ip?: string) {
    return this.logModel.save({ adminId, action, target, targetId, detail, ip } as any);
  }
}
```

- [ ] **Step 3: 创建 AdminAuthController**

```typescript
// packages/server/src/modules/admin/controller/admin-auth.controller.ts
import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { AdminAuthService } from '../service/admin-auth.service';

@Controller('/api/v1/admin/auth')
export class AdminAuthController {
  @Inject() adminAuthService: AdminAuthService;

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.adminAuthService.login(body.username, body.password);
  }

  @Post('/refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.adminAuthService.refresh(body.refreshToken);
  }

  @Post('/logout')
  async logout() {
    return { success: true };
  }
}
```

- [ ] **Step 4: 创建 AdminController（所有管理后台API）**

```typescript
// packages/server/src/modules/admin/controller/admin.controller.ts
import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { AdminService } from '../service/admin.service';

@Controller('/api/v1/admin')
export class AdminController {
  @Inject() adminService: AdminService;

  // === 用户管理 ===
  @Get('/users') async listUsers(@Query() q: any) { return this.adminService.listUsers(q); }
  @Put('/users/:id/status') async toggleUserStatus(@Param('id') id: number, @Body() b: { status: number }) {
    return this.adminService.toggleUserStatus(id, b.status);
  }

  // === 商家管理 ===
  @Get('/merchants') async listMerchants(@Query() q: any) { return this.adminService.listMerchants(q); }
  @Get('/merchant-applications') async listApplications(@Query() q: any) { return this.adminService.listApplications(q); }
  @Post('/merchant-applications/:id/review') async reviewApplication(@Param('id') id: number, @Body() b: any) {
    return this.adminService.reviewApplication(id, b.reviewerId || 1, b.status, b.rejectReason);
  }

  // === 角色权限 ===
  @Get('/roles') async listRoles() { return this.adminService.roleModel.find({ where: { deletedAt: undefined } }); }
  @Post('/roles') async createRole(@Body() b: any) { return this.adminService.roleModel.save(b); }
  @Put('/roles/:id') async updateRole(@Param('id') id: number, @Body() b: any) { await this.adminService.roleModel.update(id, b); return this.adminService.roleModel.findOne({ where: { id } }); }

  // === 数据看板 ===
  @Get('/dashboard') async dashboard() { return this.adminService.getDashboard(); }

  // === 轮播图 ===
  @Get('/banners') async listBanners() { return this.adminService.listBanners(); }
  @Post('/banners') async createBanner(@Body() b: any) { return this.adminService.createBanner(b); }
  @Put('/banners/:id') async updateBanner(@Param('id') id: number, @Body() b: any) { return this.adminService.updateBanner(id, b); }
  @Del('/banners/:id') async deleteBanner(@Param('id') id: number) { await this.adminService.deleteBanner(id); return { success: true }; }

  // === 公告 ===
  @Get('/announcements') async listAnnouncements(@Query() q: any) { return this.adminService.listAnnouncements(q); }
  @Post('/announcements') async createAnnouncement(@Body() b: any) { return this.adminService.createAnnouncement(b); }
  @Put('/announcements/:id') async updateAnnouncement(@Param('id') id: number, @Body() b: any) { return this.adminService.updateAnnouncement(id, b); }
  @Del('/announcements/:id') async deleteAnnouncement(@Param('id') id: number) { await this.adminService.deleteAnnouncement(id); return { success: true }; }

  // === 推荐位 ===
  @Get('/recommendations') async listRecommendations() { return this.adminService.listRecommendations(); }
  @Post('/recommendations') async createRecommendation(@Body() b: any) { return this.adminService.createRecommendation(b); }
  @Put('/recommendations/:id') async updateRecommendation(@Param('id') id: number, @Body() b: any) { return this.adminService.updateRecommendation(id, b); }
  @Del('/recommendations/:id') async deleteRecommendation(@Param('id') id: number) { await this.adminService.deleteRecommendation(id); return { success: true }; }

  // === 系统消息 ===
  @Get('/messages') async listMessages(@Query() q: any) { return this.adminService.listMessages(q); }
  @Post('/messages') async sendMessage(@Body() b: any) { return this.adminService.sendMessage(b); }

  // === 财务 ===
  @Get('/finance') async listFinance(@Query() q: any) { return this.adminService.listFinance(q); }

  // === 系统配置 ===
  @Get('/config') async getConfig(@Query('key') key?: string) { return this.adminService.getConfig(key); }
  @Put('/config/:key') async setConfig(@Param('key') key: string, @Body() b: { value: string }) { return this.adminService.setConfig(key, b.value); }

  // === 敏感词 ===
  @Get('/sensitive-words') async listSensitiveWords() { return this.adminService.listSensitiveWords(); }
  @Post('/sensitive-words') async createSensitiveWord(@Body() b: any) { return this.adminService.createSensitiveWord(b); }
  @Del('/sensitive-words/:id') async deleteSensitiveWord(@Param('id') id: number) { await this.adminService.deleteSensitiveWord(id); return { success: true }; }

  // === 操作日志 ===
  @Get('/operation-logs') async listOperationLogs(@Query() q: any) { return this.adminService.listOperationLogs(q); }
}
```

- [ ] **Step 5: 修改 auth.middleware.ts，添加 admin API 白名单和 admin Token 校验**

在 auth.middleware.ts 的 whitelist 中添加 `/api/v1/admin/auth/login` 和 `/api/v1/admin/auth/refresh`。
新增 admin 端点的校验逻辑（允许 admin Token 访问 /api/v1/admin/* 路径）。

---

### Task 3: 管理后台 API 服务层 + 登录页

**Files:**
- Create: `packages/web-admin/src/services/admin.ts`
- Create: `packages/web-admin/src/pages/login/index.tsx`
- Modify: `packages/web-admin/src/App.tsx`（添加登录路由和鉴权逻辑）

- [ ] **Step 1: 创建 admin API 服务**

```typescript
// packages/web-admin/src/services/admin.ts
import api from './api';

export const adminApi = {
  login(username: string, password: string) {
    return api.post('/admin/auth/login', { username, password }).then(res => res.data);
  },
  refresh(refreshToken: string) {
    return api.post('/admin/auth/refresh', { refreshToken }).then(res => res.data);
  },
  getDashboard() {
    return api.get('/admin/dashboard').then(res => res.data);
  },
  // 用户管理
  listUsers(params?: any) { return api.get('/admin/users', { params }).then(res => res.data); },
  toggleUserStatus(id: number, status: number) { return api.put(`/admin/users/${id}/status`, { status }).then(res => res.data); },
  // 商家
  listMerchants(params?: any) { return api.get('/admin/merchants', { params }).then(res => res.data); },
  listApplications(params?: any) { return api.get('/admin/merchant-applications', { params }).then(res => res.data); },
  reviewApplication(id: number, data: any) { return api.post(`/admin/merchant-applications/${id}/review`, data).then(res => res.data); },
  // 角色
  listRoles() { return api.get('/admin/roles').then(res => res.data); },
  createRole(data: any) { return api.post('/admin/roles', data).then(res => res.data); },
  updateRole(id: number, data: any) { return api.put(`/admin/roles/${id}`, data).then(res => res.data); },
  // 轮播图
  listBanners() { return api.get('/admin/banners').then(res => res.data); },
  createBanner(data: any) { return api.post('/admin/banners', data).then(res => res.data); },
  updateBanner(id: number, data: any) { return api.put(`/admin/banners/${id}`, data).then(res => res.data); },
  deleteBanner(id: number) { return api.delete(`/admin/banners/${id}`).then(res => res.data); },
  // 公告
  listAnnouncements(params?: any) { return api.get('/admin/announcements', { params }).then(res => res.data); },
  createAnnouncement(data: any) { return api.post('/admin/announcements', data).then(res => res.data); },
  updateAnnouncement(id: number, data: any) { return api.put(`/admin/announcements/${id}`, data).then(res => res.data); },
  deleteAnnouncement(id: number) { return api.delete(`/admin/announcements/${id}`).then(res => res.data); },
  // 推荐位
  listRecommendations() { return api.get('/admin/recommendations').then(res => res.data); },
  createRecommendation(data: any) { return api.post('/admin/recommendations', data).then(res => res.data); },
  updateRecommendation(id: number, data: any) { return api.put(`/admin/recommendations/${id}`, data).then(res => res.data); },
  deleteRecommendation(id: number) { return api.delete(`/admin/recommendations/${id}`).then(res => res.data); },
  // 系统消息
  listMessages(params?: any) { return api.get('/admin/messages', { params }).then(res => res.data); },
  sendMessage(data: any) { return api.post('/admin/messages', data).then(res => res.data); },
  // 财务
  listFinance(params?: any) { return api.get('/admin/finance', { params }).then(res => res.data); },
  // 系统配置
  getConfig(key?: string) { return api.get('/admin/config', { params: { key } }).then(res => res.data); },
  setConfig(key: string, value: string) { return api.put(`/admin/config/${key}`, { value }).then(res => res.data); },
  // 敏感词
  listSensitiveWords() { return api.get('/admin/sensitive-words').then(res => res.data); },
  createSensitiveWord(data: any) { return api.post('/admin/sensitive-words', data).then(res => res.data); },
  deleteSensitiveWord(id: number) { return api.delete(`/admin/sensitive-words/${id}`).then(res => res.data); },
  // 操作日志
  listOperationLogs(params?: any) { return api.get('/admin/operation-logs', { params }).then(res => res.data); },
};
```

- [ ] **Step 2: 创建管理员登录页**

```typescript
// packages/web-admin/src/pages/login/index.tsx
// 简洁的登录表单：用户名 + 密码输入框，登录按钮
// 调用 adminApi.login() → 保存 token 到 localStorage → 跳转 /dashboard
```

- [ ] **Step 3: 修改 App.tsx — 添加登录路由、Token 检测逻辑**

在 App.tsx 中添加：
- `/login` 路由指向 Login 页面
- 根路径 `/` 重定向到 `/login`（未登录时）
- 已登录时 `/login` 重定向到 `/dashboard`
- 从 localStorage 读取 admin_token 判断登录状态

---

### Task 4: 用户管理 + 商家入驻审核页面

**Files:**
- Create: `packages/web-admin/src/pages/user/index.tsx`
- Create: `packages/web-admin/src/pages/merchant/index.tsx`
- Create: `packages/web-admin/src/pages/merchant/applications.tsx`
- Modify: `packages/web-admin/src/App.tsx`（添加路由）

- [ ] **Step 1: 用户管理页面**

ProTable 展示用户列表，列：ID、昵称、手机号、状态、注册时间
操作：封禁/解封切换按钮

- [ ] **Step 2: 商家管理页面**

ProTable 展示商家列表，列：店铺名、所属模块、联系人、状态、入驻时间
操作：查看详情、修改状态

- [ ] **Step 3: 商家入驻审核页面**

Tab 切换：待审核 / 已通过 / 已驳回
审核操作：查看资质 → 通过（选择模块）/ 驳回（填写原因）

- [ ] **Step 4: 角色权限管理页面**

ProTable 角色列表 + Modal 编辑权限（checkboxes）

---

### Task 5: 数据看板页面

**Files:**
- Create: `packages/web-admin/src/pages/dashboard/index.tsx`
- Modify: `packages/web-admin/src/App.tsx`

- [ ] **Step 1: 数据看板页面**

使用 ECharts 展示：
- 顶部统计卡片4个：总订单数、总GMV、今日订单、活跃商家
- 折线图：近7天订单趋势（从 orders API 按日期统计）
- 饼图：各模块订单占比
- 表格：热销商品/热门民宿 TOP5（跨模块数据汇总）

```typescript
// 使用 echarts-for-react
import ReactECharts from 'echarts-for-react';
// 顶部 StatisticCard 复用现有样式
```

---

### Task 6: 首页运营页面

**Files:**
- Create: `packages/web-admin/src/pages/operation/index.tsx`
- Create: `packages/web-admin/src/pages/operation/banners.tsx`
- Create: `packages/web-admin/src/pages/operation/announcements.tsx`
- Create: `packages/web-admin/src/pages/operation/recommendations.tsx`
- Modify: `packages/web-admin/src/App.tsx`

- [ ] **Step 1: 轮播图管理**

ProTable + Modal 表单，字段：标题、图片URL、跳转链接、排序、上下架
支持拖拽排序

- [ ] **Step 2: 公告管理**

ProTable + Modal，字段：标题、内容、发布时间、状态

- [ ] **Step 3: 推荐位管理**

ProTable + Modal，字段：推荐位名称、关联类型（下拉选择商品/民宿/景区/路线/游记）、关联ID、排序

---

### Task 7: 消息中心 + 财务结算 + 系统设置页面

**Files:**
- Create: `packages/web-admin/src/pages/message/index.tsx`
- Create: `packages/web-admin/src/pages/finance/index.tsx`
- Create: `packages/web-admin/src/pages/system/index.tsx`
- Create: `packages/web-admin/src/pages/system/sensitive-words.tsx`
- Create: `packages/web-admin/src/pages/system/operation-logs.tsx`
- Modify: `packages/web-admin/src/App.tsx`

- [ ] **Step 1: 消息中心页面**

历史消息列表（ProTable）+ 发送新消息 Modal（选择用户/群发）

- [ ] **Step 2: 财务结算页面**

ProTable 结算记录列表，状态Tag（待结算/已结算/已到账）
搜索筛选：商家名、时间范围、状态

- [ ] **Step 3: 系统设置页面**

Form 表单：平台抽佣比例（各模块分别配置）、敏感词库（增删列表）
底部 Tab 或 Card 分组

- [ ] **Step 4: 操作日志页面**

只读 ProTable 展示操作日志，列：操作人、操作类型、操作对象、时间、IP

---

### Task 8: 更新 App.tsx 菜单和路由

**Files:**
- Modify: `packages/web-admin/src/App.tsx`

- [ ] **Step 1: 更新菜单配置**

在现有菜单中补充缺失的管理页面：

```typescript
const menuItems = [
  { path: '/dashboard', name: '数据看板', icon: <DashboardOutlined /> },
  // ... 现有业务管理子菜单 ...
  {
    path: '/user',
    name: '用户管理',
    icon: <UserOutlined />,
    children: [
      { path: '/user/list', name: '游客管理' },
      { path: '/user/merchants', name: '商家管理' },
      { path: '/user/roles', name: '角色权限' },
      { path: '/user/applications', name: '入驻审核' },
    ],
  },
  { path: '/order', name: '全局订单', icon: <ShoppingCartOutlined /> },
  {
    path: '/operation',
    name: '首页运营',
    icon: <AppstoreOutlined />,
    children: [
      { path: '/operation/banners', name: '轮播图管理' },
      { path: '/operation/announcements', name: '公告管理' },
      { path: '/operation/recommendations', name: '推荐位管理' },
    ],
  },
  { path: '/message', name: '消息中心', icon: <BellOutlined /> },
  { path: '/finance', name: '财务结算', icon: <DollarOutlined /> },
  {
    path: '/system',
    name: '系统设置',
    icon: <SettingOutlined />,
    children: [
      { path: '/system/config', name: '系统配置' },
      { path: '/system/sensitive-words', name: '敏感词库' },
      { path: '/system/logs', name: '操作日志' },
    ],
  },
];
```

- [ ] **Step 2: 添加所有新路由到 `<Routes>`**

---

### Task 9: 全局订单页面 + 内容审核完善

**Files:**
- Modify: `packages/web-admin/src/pages/clothing/orders.tsx` → 复用为全局订单
- 或 Create: `packages/web-admin/src/pages/order/index.tsx`

- [ ] **Step 1: 全局订单页面**

跨模块订单查询（orderType 字段区分 clothing/food_meal/accommodation/travel）
ProTable 列：订单号、订单类型（Tag）、用户ID、金额、状态（Tag）、时间
搜索：订单类型下拉、状态下拉、日期范围
操作：查看详情（Modal）、取消订单（异常订单处理）

---

### Task 10: 商家后台框架

**Files:**
- Create: `packages/web-admin/src/pages/merchant/dashboard.tsx`
- Create: `packages/web-admin/src/pages/merchant/settings.tsx`
- Create: `packages/web-admin/src/layouts/MerchantLayout.tsx`
- Modify: `packages/web-admin/src/App.tsx`

**说明：** 商家后台供商家登录使用，有单独的 layout 和导航，业务管理页面（商品/订单/房源等）由模块1-4嵌入

- [ ] **Step 1: 商家后台 Layout**

仿管理后台 ProLayout 但精简侧边栏，包含：工作台、店铺设置、数据统计、商品管理（嵌入模块1）、订单管理（嵌入模块2-4）、消息通知

- [ ] **Step 2: 商家工作台**

StatisticCard 展示：今日订单数、待处理订单、营业额
近期订单列表（简化版）

- [ ] **Step 3: 商家店铺设置**

Form 表单：店铺名、联系人、联系电话、店铺简介、封面图

---

### Task 11: Seed 数据脚本

**Files:**
- Create: `packages/server/src/modules/admin/seed.ts` 或 SQL 文件

- [ ] **Step 1: 创建默认管理员和角色**

```sql
-- 创建默认角色
INSERT INTO wd_admin_role (name, permissions) VALUES
('超级管理员', '["*"]'),
('运营人员', '["dashboard:view", "banner:crud", "announcement:crud", "message:send"]'),
('客服', '["user:list", "order:list", "order:edit", "message:send"]');

-- 创建默认管理员（密码: admin123）
INSERT INTO wd_admin (username, password, real_name, role_id, status) VALUES
('admin', '$2b$12$...bcrypt_hash...', '系统管理员', 1, 1);

-- 默认系统配置
INSERT INTO wd_admin_system_config (key, value, description) VALUES
('commission.clothing', '5', '商品模块抽佣比例(%)'),
('commission.food', '10', '餐饮模块抽佣比例(%)'),
('commission.accommodation', '10', '住宿模块抽佣比例(%)'),
('commission.travel', '10', '出行模块抽佣比例(%)');
```
