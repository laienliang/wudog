// ============================================================
// 房态日历 DTO
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\calendar.ts
// ============================================================
import { Rule, RuleType } from '@midwayjs/validate';

/** 查询某房型某日期范围的房态 */
export class CalendarQueryDTO {
  @Rule(RuleType.number().integer().required())
  roomId: number;

  @Rule(RuleType.string().required())
  startDate: string;

  @Rule(RuleType.string().required())
  endDate: string;
}

/** 批量编辑房态：库存 + 价格 */
export class CalendarBatchEditDTO {
  @Rule(RuleType.number().integer().required())
  roomId: number;

  @Rule(RuleType.string().required())
  startDate: string;

  @Rule(RuleType.string().required())
  endDate: string;

  @Rule(RuleType.number().integer().min(0).optional())
  availableStock?: number;

  @Rule(RuleType.number().min(0).optional())
  price?: number;

  @Rule(RuleType.number().integer().valid(1, 2, 3).optional())
  status?: number; // 1=可售 2=满房 3=关房
}

/** 单日编辑 */
export class CalendarSingleEditDTO {
  @Rule(RuleType.number().integer().required())
  roomId: number;

  @Rule(RuleType.string().required())
  date: string;

  @Rule(RuleType.number().integer().min(0).optional())
  availableStock?: number;

  @Rule(RuleType.number().min(0).optional())
  price?: number;

  @Rule(RuleType.number().integer().valid(1, 2, 3).optional())
  status?: number;
}
