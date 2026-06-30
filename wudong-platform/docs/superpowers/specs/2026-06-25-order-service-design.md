# 统一订单服务 — 设计文档

> 日期：2026-06-25
> 项目：乌东文旅"衣食住行"综合服务平台
> 状态：设计完成，待实施

---

## 1. 需求概述

为衣（商品订单）、食（餐位预订+农产品）、住（住宿预订）、行（门票+路线）四种订单类型提供统一的订单服务，包含订单创建、状态流转、审计日志。

## 2. 订单号生成

采用雪花算法（Snowflake）生成 19 位纯数字订单号：

| 位段 | 位数 | 说明 |
|------|------|------|
| 时间戳 | 41位 | 毫秒级，自定义纪元 |
| 机器ID | 10位 | 单机可设为 0 |
| 序列号 | 12位 | 同一毫秒内自增 |

**特点**：绝对唯一、含时间信息、有序递增、纯数字

## 3. 订单状态机

```
                                  ┌─ 取消订单（15分钟未支付自动取消）
待支付 ──────────────────────────┼─ 用户主动取消
  │
  ├─ 支付成功 → 待确认 ──────────┼─ 商家确认 → 已确认
  │                             ├─ 24小时未确认自动确认
  │                             └─ 商家拒绝（退款）
  │
  ├─ 已确认 → 已使用/已完成 ─────┼─ 用户确认收货（7日自动确认）
  │                             ├─ 扫码核销（电子票）
  │                             └─ 入住完成（住宿）
  │
  ├─ 申请退款 ──────────────────┼─ 商家/管理员同意 → 原路退回
  │                             └─ 驳回 → 维持原状态
  │
  └─ 已完成 ──→ 评价（文字+图片+1-5星）
```

## 4. API 接口

| 方法 | 端点 | 认证 | 说明 |
|------|------|------|------|
| POST | `/api/v1/orders` | ✅ | 创建订单 |
| GET | `/api/v1/orders` | ✅ | 当前用户订单列表（分页，按类型筛选） |
| GET | `/api/v1/orders/:id` | ✅ | 订单详情（含明细） |
| POST | `/api/v1/orders/:id/cancel` | ✅ | 取消订单 |
| POST | `/api/v1/orders/:id/pay` | ✅ | 支付回调（标记已支付） |
| POST | `/api/v1/orders/:id/confirm` | ✅ | 确认收货/完成 |
| GET | `/api/v1/orders/:id/logs` | ✅ | 订单状态日志 |

## 5. 数据模型

### wd_order（已有表）

| 字段 | 说明 |
|------|------|
| order_no | 雪花算法订单号 |
| user_id | 用户ID |
| merchant_id | 商家ID |
| order_type | clothing/food_meal/food_product/accommodation/travel |
| total_amount | 总金额 |
| pay_amount | 实付金额 |
| status | pending_pay/paid/confirmed/completed/refunded/cancelled |
| pay_type | wechat |
| pay_time | 支付时间 |
| remark | 备注 |

### wd_order_item（已有表，无需修改）

| 字段 | 说明 |
|------|------|
| order_id | 订单ID |
| product_type | 商品类型 |
| product_id | 商品ID |
| product_name | 商品名称 |
| product_image | 商品图片 |
| sku_id | SKU ID |
| sku_name | SKU名称 |
| unit_price | 单价 |
| quantity | 数量 |
| subtotal | 小计 |

### wd_order_status_log（已有表，无需修改）

| 字段 | 说明 |
|------|------|
| order_id | 订单ID |
| from_status | 原状态 |
| to_status | 新状态 |
| operator | 操作人 |
| remark | 备注 |

## 6. 目录结构

```
packages/server/src/modules/order/
├── controller/
│   └── order.controller.ts
├── service/
│   ├── order.service.ts            # 订单主服务
│   └── snowflake.service.ts        # 雪花算法ID生成
├── dto/
│   ├── create-order.dto.ts         # 创建订单DTO
│   └── order-query.dto.ts          # 订单查询DTO
└── interface/
    └── order.interface.ts           # 类型定义
```

## 7. 错误码

| code | 场景 |
|------|------|
| 400 | 参数错误（商品不存在、库存不足） |
| 404 | 订单不存在 |
| 409 | 订单状态不允许当前操作 |
| 422 | 业务校验失败（如：已支付的订单不能取消） |
