# 住宿模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成住宿模块的后端API + 管理后台，支持民宿/房型/日历/订单/评价的完整管理链路。

**Architecture:** 后端使用 Midway.js 分层架构（entity→service→controller），管理后台使用 React + Ant Design Pro，Tabs 切分5个子页面，复用统一订单服务。

**Tech Stack:** Midway.js v3, TypeORM, React 18, Ant Design 5.x, ProTable, dayjs

## Global Constraints

- 后端实体命名 `wd_accommodation_*` 蛇形表名
- 所有 API 基础路径 `/api/v1`
- 管理后台品牌色 `#1F5FA8`
- 所有业务数据软删除（`deleted_at`）
- 新增路由必须在 auth.middleware.ts 白名单注册

---

### Task 1: 后端实体 + Calendar 实体 + Service/Controller 骨架

**Files:**
- Create: `packages/server/src/modules/accommodation/entity/calendar.entity.ts`
- Create: `packages/server/src/modules/accommodation/service/accommodation.service.ts`
- Create: `packages/server/src/modules/accommodation/controller/accommodation.controller.ts`
- Modify: `packages/server/src/common/middleware/auth.middleware.ts`

**Interfaces:**
- Produces: `AccommodationService` with methods for homestay/roomType/calendar CRUD
- Produces: `AccommodationController` with RESTful endpoints
- Produces: Auth whitelist entry for `/api/v1/accommodation*` and `/api/v1/homestays*`

- [ ] **Step 1: Create Calendar entity**

Write `packages/server/src/modules/accommodation/entity/calendar.entity.ts`:

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_accommodation_calendar')
export class Calendar extends BaseEntity {
  @Column({ name: 'room_type_id' })
  roomTypeId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'tinyint', nullable: true, comment: 'NULL正常 1满房 2维护' })
  status: number;
}
```

- [ ] **Step 2: Create AccommodationService**

Write `packages/server/src/modules/accommodation/service/accommodation.service.ts` with full CRUD:

```typescript
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Between } from 'typeorm';
import { Homestay } from '../entity/homestay.entity';
import { RoomType } from '../entity/room-type.entity';
import { Calendar } from '../entity/calendar.entity';

@Provide()
export class AccommodationService {
  @InjectEntityModel(Homestay)
  homestayModel: Repository<Homestay>;

  @InjectEntityModel(RoomType)
  roomTypeModel: Repository<RoomType>;

  @InjectEntityModel(Calendar)
  calendarModel: Repository<Calendar>;

  // ===== 民宿 =====
  async listHomestays(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const qb = this.homestayModel.createQueryBuilder('h')
      .where('h.deletedAt IS NULL')
      .orderBy('h.createdAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);
    if (keyword) qb.andWhere('h.name LIKE :kw', { kw: `%${keyword}%` });
    const [list, total] = await qb.getManyAndCount();
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getAllHomestays() {
    return this.homestayModel.find({ where: { deletedAt: undefined }, order: { createdAt: 'DESC' } });
  }

  async getHomestay(id: number) {
    const h = await this.homestayModel.findOne({ where: { id } });
    if (!h) throw new Error('民宿不存在');
    const roomTypes = await this.roomTypeModel.find({ where: { homestayId: id, deletedAt: undefined } });
    return { ...h, roomTypes };
  }

  async createHomestay(data: any) { return this.homestayModel.save(data); }
  async updateHomestay(id: number, data: any) { await this.homestayModel.update(id, data); return this.homestayModel.findOne({ where: { id } }); }
  async deleteHomestay(id: number) { return this.homestayModel.softDelete(id); }

  // ===== 房型 =====
  async listRoomTypes(homestayId?: number) {
    const where: any = { deletedAt: undefined };
    if (homestayId) where.homestayId = homestayId;
    return this.roomTypeModel.find({ where, order: { createdAt: 'DESC' } });
  }

  async createRoomType(data: any) { return this.roomTypeModel.save(data); }
  async updateRoomType(id: number, data: any) { await this.roomTypeModel.update(id, data); return this.roomTypeModel.findOne({ where: { id } }); }
  async deleteRoomType(id: number) { return this.roomTypeModel.softDelete(id); }

  // ===== 房态日历 =====
  async getCalendar(roomTypeId: number, month: string) {
    const start = `${month}-01`;
    // 计算月末
    const year = parseInt(month.slice(0, 4));
    const mon = parseInt(month.slice(5, 7));
    const lastDay = new Date(year, mon, 0).getDate();
    const end = `${month}-${String(lastDay).padStart(2, '0')}`;

    return this.calendarModel.find({
      where: { roomTypeId, date: Between(start, end) },
      order: { date: 'ASC' },
    });
  }

  async batchSetCalendar(data: { roomTypeId: number; startDate: string; endDate: string; price?: number; stock?: number; status?: number }) {
    const { roomTypeId, startDate, endDate, price, stock, status } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const results = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const existing = await this.calendarModel.findOne({ where: { roomTypeId, date: dateStr } });
      if (existing) {
        if (price !== undefined) existing.price = price;
        if (stock !== undefined) existing.stock = stock;
        if (status !== undefined) existing.status = status;
        results.push(await this.calendarModel.save(existing));
      } else {
        results.push(await this.calendarModel.save({
          roomTypeId,
          date: dateStr,
          price: price || 0,
          stock: stock || 0,
          status: status || null,
        }));
      }
    }
    return { count: results.length };
  }

  // ===== 住宿订单 =====
  async listAccommodationOrders(query: any) {
    const { page = 1, pageSize = 10, status } = query;
    let sql = `SELECT o.*, r.name AS room_name, h.name AS homestay_name
      FROM wd_order o
      LEFT JOIN wd_order_item oi ON o.id = oi.order_id
      LEFT JOIN wd_accommodation_room_type r ON oi.product_id = r.id
      LEFT JOIN wd_accommodation_homestay h ON r.homestay_id = h.id
      WHERE o.order_type = 'accommodation' AND o.deleted_at IS NULL`;
    const params: any[] = [];
    if (status) { sql += ' AND o.status = ?'; params.push(status); }
    sql += ' ORDER BY o.created_at DESC';

    const countResult = await this.homestayModel.query(`SELECT COUNT(*) AS total FROM wd_order WHERE order_type = 'accommodation' AND deleted_at IS NULL`, params);
    const total = Number(countResult[0]?.total || 0);
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${Number(pageSize)} OFFSET ${Number(offset)}`;
    const list = await this.homestayModel.query(sql, params);
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }
}
```

- [ ] **Step 3: Create AccommodationController**

Write `packages/server/src/modules/accommodation/controller/accommodation.controller.ts`:

```typescript
import { Controller, Get, Post, Put, Del, Param, Body, Query, Inject } from '@midwayjs/core';
import { AccommodationService } from '../service/accommodation.service';

@Controller('/api/v1')
export class AccommodationController {
  @Inject()
  accommodationService: AccommodationService;

  // 民宿
  @Get('/homestays') async list(@Query() q: any) { return this.accommodationService.listHomestays(q); }
  @Get('/homestays/all') async all() { return this.accommodationService.getAllHomestays(); }
  @Get('/homestays/:id') async detail(@Param('id') id: number) { return this.accommodationService.getHomestay(id); }
  @Post('/homestays') async create(@Body() b: any) { return this.accommodationService.createHomestay(b); }
  @Put('/homestays/:id') async update(@Param('id') id: number, @Body() b: any) { return this.accommodationService.updateHomestay(id, b); }
  @Del('/homestays/:id') async delete(@Param('id') id: number) { await this.accommodationService.deleteHomestay(id); return { success: true }; }

  // 房型
  @Get('/homestays/:id/room-types') async roomTypes(@Param('id') id: number) { return this.accommodationService.listRoomTypes(id); }
  @Post('/room-types') async createRoomType(@Body() b: any) { return this.accommodationService.createRoomType(b); }
  @Put('/room-types/:id') async updateRoomType(@Param('id') id: number, @Body() b: any) { return this.accommodationService.updateRoomType(id, b); }
  @Del('/room-types/:id') async deleteRoomType(@Param('id') id: number) { await this.accommodationService.deleteRoomType(id); return { success: true }; }

  // 日历
  @Get('/room-types/:id/calendar') async calendar(@Param('id') id: number, @Query('month') month: string) { return this.accommodationService.getCalendar(id, month); }
  @Post('/calendar/batch') async batchCalendar(@Body() b: any) { return this.accommodationService.batchSetCalendar(b); }

  // 住宿订单
  @Get('/accommodation-orders') async orders(@Query() q: any) { return this.accommodationService.listAccommodationOrders(q); }
}
```

- [ ] **Step 4: Update auth whitelist**

Edit `packages/server/src/common/middleware/auth.middleware.ts` — add to the whitelist logic:

Find the line with `isFoodEndpoint` and add:
```typescript
const isAccommodationEndpoint = ctx.path.startsWith('/api/v1/homestays') || ctx.path.startsWith('/api/v1/room-types') || ctx.path.startsWith('/api/v1/calendar') || ctx.path.startsWith('/api/v1/accommodation-orders');
```

Then add `isAccommodationEndpoint` to the condition:
```typescript
if (isAuthRoute || isGetWhitelisted || isAdminEndpoint || isReviewEndpoint || isFoodEndpoint || isAccommodationEndpoint) {
```

- [ ] **Step 5: Seed demo data**

Run this SQL to add sample homestays and room types:

```bash
mysql -u root -p050228hdl wudong_platform < docs/superpowers/plans/seed-accommodation.sql
```

Create `docs/superpowers/plans/seed-accommodation.sql`:

```sql
-- 民宿数据
INSERT INTO wd_accommodation_homestay (id, merchant_id, name, cover_image, phone, address, description, facilities, rating, status) VALUES
(1, 1, '苗寨木楼客栈', 'http://localhost:3000/images/restaurant/rest1.jpg', '13988880001', '乌东村口广场旁', '正宗苗家木楼，推窗见梯田，夜晚听蛙鸣', '["WiFi","独立卫浴","苗族特色","空调","观景台"]', 4.8, 1),
(2, 1, '梯田观景民宿', 'http://localhost:3000/images/restaurant/rest2.jpg', '13988880002', '乌东村梯田上方', '坐落于梯田之上，每个房间都能看日出', '["WiFi","独立卫浴","观景阳台","含早餐"]', 4.9, 1),
(3, 1, '吊脚楼人家', 'http://localhost:3000/images/restaurant/rest3.jpg', '13988880003', '乌东村老寨区', '百年历史的苗家吊脚楼，感受原生态苗族生活', '["WiFi","公共卫浴","苗族特色","火塘"]', 4.5, 1),
(4, 1, '苗绣人家', 'http://localhost:3000/images/restaurant/rest4.jpg', '13988880004', '乌东村绣娘坊旁', '女主人是苗绣传承人，可体验苗绣制作', '["WiFi","独立卫浴","苗绣体验","含早餐","空调"]', 4.7, 1),
(5, 1, '清溪别院', 'http://localhost:3000/images/restaurant/rest5.jpg', '13988880005', '乌东村溪水边', '临溪而建的小院，门前有溪水流过，清静宜人', '["WiFi","独立卫浴","庭院","烧烤区","停车场"]', 4.6, 0);

-- 房型数据
INSERT INTO wd_accommodation_room_type (id, homestay_id, name, area, bed_type, max_guests, price, weekend_price, quantity) VALUES
(1, 1, '苗族木屋大床房', '30㎡', '1.8m大床', 2, 288.00, 358.00, 3),
(2, 1, '苗族木屋双床房', '35㎡', '1.2m双床', 2, 258.00, 328.00, 2),
(3, 1, '家庭套房', '50㎡', '1.8m大床+1.2m小床', 4, 488.00, 588.00, 1),
(4, 2, '梯田全景大床房', '35㎡', '1.8m大床', 2, 388.00, 458.00, 2),
(5, 2, '梯田全景双床房', '35㎡', '1.2m双床', 2, 358.00, 428.00, 2),
(6, 3, '吊脚楼特色房', '25㎡', '1.5m大床', 2, 188.00, 238.00, 2),
(7, 3, '吊脚楼通铺房', '30㎡', '榻榻米', 4, 288.00, 358.00, 1),
(8, 4, '苗绣主题大床房', '30㎡', '1.8m大床', 2, 328.00, 398.00, 2),
(9, 4, '苗绣主题双床房', '35㎡', '1.2m双床', 2, 298.00, 368.00, 1),
(10, 5, '临溪大床房', '28㎡', '1.8m大床', 2, 258.00, 318.00, 2);
```

- [ ] **Step 6: Verify backend starts and APIs respond**

```bash
# Restart backend after code changes
curl -s http://localhost:7001/api/v1/homestays | grep -o '"total":[0-9]*'
# Expected: "total":5
curl -s http://localhost:7001/api/v1/homestays/1 | grep -o '"name":"[^"]*"'
# Expected: "name":"苗寨木楼客栈"
```

- [ ] **Step 7: Commit**

```bash
git add packages/server/src/modules/accommodation/ packages/server/src/common/middleware/auth.middleware.ts docs/superpowers/plans/seed-accommodation.sql
git commit -m "feat(accommodation): add backend entities, service, controller with CRUD APIs"
```

---

### Task 2: 管理后台 - 住宿API + 路由 + Tabs布局

**Files:**
- Create: `packages/web-admin/src/services/accommodation.ts`
- Create: `packages/web-admin/src/pages/modules/accommodation/index.tsx`
- Modify: `packages/web-admin/src/App.tsx`

**Interfaces:**
- Produces: `accommodationApi` object with all API methods
- Produces: `AccommodationAdmin` with Tabs layout

- [ ] **Step 1: Create accommodation API service**

Write `packages/web-admin/src/services/accommodation.ts`:

```typescript
import api from './api';

export const accommodationApi = {
  // 民宿
  listHomestays(params?: any) { return api.get('/homestays', { params }).then(r => r.data); },
  allHomestays() { return api.get('/homestays/all').then(r => r.data); },
  getHomestay(id: number) { return api.get(`/homestays/${id}`).then(r => r.data); },
  createHomestay(data: any) { return api.post('/homestays', data).then(r => r.data); },
  updateHomestay(id: number, data: any) { return api.put(`/homestays/${id}`, data).then(r => r.data); },
  deleteHomestay(id: number) { return api.delete(`/homestays/${id}`).then(r => r.data); },

  // 房型
  listRoomTypes(homestayId?: number) {
    if (homestayId) return api.get(`/homestays/${homestayId}/room-types`).then(r => r.data);
    // 获取所有房型（遍历民宿）
    return api.get('/homestays/all').then(async (res: any) => {
      const list = res.data?.data || res.data || [];
      const all: any[] = [];
      for (const h of list) {
        const rt = await api.get(`/homestays/${h.id}/room-types`).then(r => r.data);
        all.push(... (rt?.data || rt || []));
      }
      return all;
    });
  },
  createRoomType(data: any) { return api.post('/room-types', data).then(r => r.data); },
  updateRoomType(id: number, data: any) { return api.put(`/room-types/${id}`, data).then(r => r.data); },
  deleteRoomType(id: number) { return api.delete(`/room-types/${id}`).then(r => r.data); },

  // 日历
  getCalendar(roomTypeId: number, month: string) { return api.get(`/room-types/${roomTypeId}/calendar`, { params: { month } }).then(r => r.data); },
  batchSetCalendar(data: any) { return api.post('/calendar/batch', data).then(r => r.data); },

  // 住宿订单
  listOrders(params?: any) { return api.get('/accommodation-orders', { params }).then(r => r.data); },
};
```

- [ ] **Step 2: Create Tabs layout**

Write `packages/web-admin/src/pages/modules/accommodation/index.tsx`:

```tsx
import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { ShopOutlined, HomeOutlined, CalendarOutlined, OrderedListOutlined, StarOutlined } from '@ant-design/icons';
import HomestayTab from './homestay';
import RoomTypeTab from './room-type';
import CalendarTab from './calendar';
import OrdersTab from './orders';
import ReviewsTab from './reviews';

const AccommodationAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('homestay');
  return (
    <div style={{ padding: 0 }}>
      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '0 24px' } }}>
        <Tabs activeKey={activeKey} onChange={setActiveKey} items={[
          { key: 'homestay', label: <span><ShopOutlined /> 民宿管理</span>, children: <HomestayTab /> },
          { key: 'room-type', label: <span><HomeOutlined /> 房型管理</span>, children: <RoomTypeTab /> },
          { key: 'calendar', label: <span><CalendarOutlined /> 房态日历</span>, children: <CalendarTab /> },
          { key: 'orders', label: <span><OrderedListOutlined /> 订单管理</span>, children: <OrdersTab /> },
          { key: 'reviews', label: <span><StarOutlined /> 评价管理</span>, children: <ReviewsTab /> },
        ]} />
      </Card>
    </div>
  );
};
export default AccommodationAdmin;
```

- [ ] **Step 3: Update App.tsx route**

In `packages/web-admin/src/App.tsx`:
- Add import: `import AccommodationAdmin from './pages/modules/accommodation';`
- Replace: `<Route path="/modules/accommodation" element={<Placeholder name="住宿管理" />} />`
- With: `<Route path="/modules/accommodation" element={<AccommodationAdmin />} />`

- [ ] **Step 4: Commit**

```bash
git add packages/web-admin/src/services/accommodation.ts packages/web-admin/src/pages/modules/accommodation/ packages/web-admin/src/App.tsx
git commit -m "feat(accommodation): add admin routes and tabs layout"
```

---

### Task 3: 管理后台 - 民宿管理 Tab

**Files:**
- Create: `packages/web-admin/src/pages/modules/accommodation/homestay.tsx`

- [ ] **Step 1: Write HomestayTab**

Create `packages/web-admin/src/pages/modules/accommodation/homestay.tsx`:

```tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, message, Popconfirm, Tag, Card, Row, Col, Statistic, Space, Typography, Divider, Tooltip, Empty, Image, Select, Switch, Rate } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined, CheckCircleOutlined, CloseCircleOutlined, HomeOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { accommodationApi } from '../../../services/accommodation';

const { Text } = Typography;
const COLORS = { primary: '#1F5FA8', success: '#6B8E3D', warning: '#E8A838', danger: '#D94A4A' };

const FACILITY_OPTIONS = ['WiFi', '空调', '独立卫浴', '苗族特色', '观景台', '含早餐', '庭院', '停车场', '火塘', '烧烤区'];

const HomestayTab: React.FC<{ onJumpToRoom?: (id: number) => void }> = ({ onJumpToRoom }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [stats, setStats] = useState({ total: 0, open: 0, closed: 0 });

  const loadStats = useCallback(async () => {
    try { const res = await accommodationApi.listHomestays({ page: 1, pageSize: 100 }); const list = res?.data?.list || []; setStats({ total: list.length, open: list.filter((r: any) => r.status === 1).length, closed: list.filter((r: any) => r.status === 0).length }); } catch {}
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const columns: ProColumns<any>[] = [
    { title: '#', width: 50, align: 'center', render: (_: any, _r: any, i: number) => i + 1 },
    { title: '民宿', dataIndex: 'name', width: 220,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src={r.coverImage} width={44} height={44} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f0' }} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
          <div><Text strong>{r.name}</Text><Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ID: {r.id}</Text></div>
        </div>
      ),
    },
    { title: '评分', dataIndex: 'rating', width: 90, align: 'center', render: (v) => <Rate disabled value={Number(v)} style={{ fontSize: 13 }} /> },
    { title: '设施', dataIndex: 'facilities', width: 220, render: (v) => v?.length ? <Space size={4}>{v.map((t: string) => <Tag key={t} style={{ borderRadius: 4 }}>{t}</Tag>)}</Space> : '-' },
    { title: '电话', dataIndex: 'phone', width: 110 },
    { title: '状态', dataIndex: 'status', width: 70, align: 'center', render: (v, r) => <Switch checked={v === 1} size="small" checkedChildren="营业" unCheckedChildren="关闭" onChange={async (c) => { await accommodationApi.updateHomestay(r.id, { status: c ? 1 : 0 }); message.success(c ? '已营业' : '已关闭'); actionRef.current?.reload(); loadStats(); }} style={{ backgroundColor: v === 1 ? COLORS.success : undefined }} /> },
    { title: '操作', width: 200, align: 'center', render: (_, r) => (
      <Space size={0}>
        <Tooltip title="管理房型"><Button type="text" size="small" icon={<HomeOutlined />} onClick={() => onJumpToRoom?.(r.id)} style={{ color: COLORS.primary }} /></Tooltip>
        <Divider type="vertical" />
        <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); form.setFieldsValue({ ...r, facilities: r.facilities || [] }); setModalOpen(true); }} style={{ color: COLORS.warning }} /></Tooltip>
        <Divider type="vertical" />
        <Popconfirm title="确定删除？" onConfirm={async () => { await accommodationApi.deleteHomestay(r.id); message.success('已删除'); actionRef.current?.reload(); loadStats(); }}><Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip></Popconfirm>
      </Space>
    )},
  ];

  return (<>
    <Row gutter={16} style={{ marginBottom: 16 }}>
      {[
        { title: '民宿总数', value: stats.total, icon: <ShopOutlined />, color: COLORS.primary, bg: '#E8F4FD' },
        { title: '营业中', value: stats.open, icon: <CheckCircleOutlined />, color: COLORS.success, bg: '#EDF7ED' },
        { title: '已关闭', value: stats.closed, icon: <CloseCircleOutlined />, color: COLORS.danger, bg: '#FFF1F0' },
      ].map(item => (
        <Col xs={8} key={item.title}>
          <Card hoverable style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 72, height: 72, borderRadius: '50%', background: item.bg, opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color }}>{item.icon}</div>
              <div><Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text><div style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value}</div></div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
    <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }} styles={{ body: { padding: '16px 24px' } }}>
      <ProTable actionRef={actionRef} columns={columns} rowKey="id" search={false}
        request={async () => { try { const res = await accommodationApi.listHomestays({ page: 1, pageSize: 100 }); return { data: res?.data?.list || [], success: true }; } catch { return { data: [], success: false }; } }}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }} style={{ boxShadow: '0 2px 6px rgba(31,95,168,0.25)' }}>新增民宿</Button>]}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无民宿数据" /> }}
      />
    </Card>
    <Modal title={editing ? '编辑民宿' : '新增民宿'} open={modalOpen} onOk={() => form.submit()} onCancel={() => setModalOpen(false)} width={640} destroyOnClose okText={editing ? '保存' : '创建'}>
      <Form form={form} layout="vertical" onFinish={async (values) => {
        try { editing ? await accommodationApi.updateHomestay(editing.id, values) : await accommodationApi.createHomestay(values); message.success(editing ? '已更新' : '已创建'); setModalOpen(false); actionRef.current?.reload(); loadStats(); } catch { message.error('操作失败'); }
      }}>
        <Form.Item name="name" label="民宿名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={16}><Col span={12}><Form.Item name="phone" label="联系电话"><Input /></Form.Item></Col>
        <Col span={12}><Form.Item name="rating" label="评分"><InputNumber min={0} max={5} step={0.1} precision={1} style={{ width: '100%' }} /></Form.Item></Col></Row>
        <Form.Item name="address" label="地址"><Input /></Form.Item>
        <Form.Item name="coverImage" label="封面图 URL"><Input placeholder="https://..." /></Form.Item>
        <Form.Item name="facilities" label="设施标签"><Select mode="multiple" placeholder="选择设施" options={FACILITY_OPTIONS.map(f => ({ label: f, value: f }))} /></Form.Item>
        <Form.Item name="description" label="民宿介绍"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  </>);
};
export default HomestayTab;
```

- [ ] **Step 2: Commit**

```bash
git add packages/web-admin/src/pages/modules/accommodation/homestay.tsx
git commit -m "feat(accommodation): add homestay management tab"
```

---

### Task 4: 管理后台 - 房型管理 Tab

**Files:**
- Create: `packages/web-admin/src/pages/modules/accommodation/room-type.tsx`

**Step 1: Write RoomTypeTab** (similar style to HomestayTab, with Select filter for homestay, table columns for room type info + price + stock)

```tsx
// Key features:
// - Top filter: homestay Select dropdown (loaded from allHomestays API)
// - Table: 排序 | 房型名+图片 | 所属民宿 | 床型 | 面积 | 容纳人数 | 平日价 | 周末价 | 库存 | 操作
// - Stock < 10 shows red warning
// - Modal: homestayId required select + name + bedType + area + maxGuests + price + weekendPrice + quantity
```

**Step 2: Commit**

---

### Task 5: 管理后台 - 房态日历 Tab

**Files:**
- Create: `packages/web-admin/src/pages/modules/accommodation/calendar.tsx`

**Step 1: Write CalendarTab**

Key features:
- Select filters: homestay → roomType → month
- Calendar grid: 7 columns (日一二三四五六), rows for each week
- Each day cell shows: date number, price (¥xxx), stock (x间)
- Color coding: green bg = available, gray = full, red = maintenance
- Batch operation panel: select date range → set price/stock/status

**Step 2: Commit**

---

### Task 6: 管理后台 - 订单管理 Tab

**Files:**
- Create: `packages/web-admin/src/pages/modules/accommodation/orders.tsx`

**Step 1: Write OrdersTab**

Key features:
- Stats cards: 全部 / 待支付 / 进行中 / 已完成
- Table: 订单号 | 民宿名 | 房型 | 入住-离店 | 金额 | 状态 | 时间
- Status tags: pending_pay=待支付, paid=已支付, confirmed=已确认, completed=已完成, cancelled=已取消
- Action buttons per status

**Step 2: Commit**

---

### Task 7: 管理后台 - 评价管理 Tab

**Files:**
- Create: `packages/web-admin/src/pages/modules/accommodation/reviews.tsx`

**Step 1: Write ReviewsTab** (simple list view, placeholder for when review data exists)

**Step 2: Commit**

---

### Task 8: 集成测试与验证

**Files:** (no new files)

- [ ] **Step 1: Restart backend and admin**

```bash
# Kill and restart backend
pid=$(netstat -ano | grep ":7001" | grep LISTEN | awk '{print $NF}' | head -1)
[ -n "$pid" ] && taskkill //F //PID $pid 2>/dev/null
sleep 1
cd packages/server && nohup npx midway-bin dev --ts --port=7001 > /tmp/midway-server.log 2>&1 &

# Kill and restart admin
pid=$(netstat -ano | grep ":3001" | grep LISTEN | awk '{print $NF}' | head -1)
[ -n "$pid" ] && taskkill //F //PID $pid 2>/dev/null
sleep 1
rm -rf packages/web-admin/node_modules/.vite
cd packages/web-admin && npx vite --port 3001 --host > /tmp/vite-admin.log 2>&1 &
```

- [ ] **Step 2: Verify all endpoints**

```bash
curl -s http://localhost:7001/api/v1/homestays | grep -o '"total":[0-9]*'  # → total:5
curl -s http://localhost:7001/api/v1/homestays/all | grep -o '"name":"[^"]*"'  # → 5 names
curl -s http://localhost:7001/api/v1/homestays/1/room-types | grep -o '"name":"[^"]*"'  # → 3 room types
curl -s http://localhost:7001/api/v1/room-types/1/calendar?month=2026-07  # → calendar entries
```

- [ ] **Step 3: Verify admin page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/  # → 200
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(accommodation): finalize integration and testing"
```
