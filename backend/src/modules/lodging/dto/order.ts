// ============================================================
// 订单 DTO
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\order.ts
// ============================================================
import { Rule, RuleType } from '@midwayjs/validate';

export class OrderListDTO {
  @Rule(RuleType.number().integer().min(1).default(1))
  page: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(20))
  pageSize: number;

  @Rule(RuleType.string().optional().allow(''))
  status?: string;
}

/** 下单 DTO */
export class OrderCreateDTO {
  @Rule(RuleType.number().integer().required())
  homestay_id: number;

  @Rule(RuleType.number().integer().required())
  room_id: number;

  @Rule(RuleType.string().required())
  check_in_date: string;

  @Rule(RuleType.string().required())
  check_out_date: string;

  @Rule(RuleType.number().integer().min(1).default(1))
  room_count: number;

  @Rule(RuleType.string().required().max(50))
  contact_name: string;

  @Rule(RuleType.string().required().max(20))
  contact_phone: string;

  @Rule(RuleType.number().integer().min(1).default(1))
  guest_count: number;
}

/** 取消订单 DTO */
export class OrderCancelDTO {
  @Rule(RuleType.number().integer().required())
  orderId: number;

  @Rule(RuleType.string().optional().allow(''))
  reason?: string;
}
