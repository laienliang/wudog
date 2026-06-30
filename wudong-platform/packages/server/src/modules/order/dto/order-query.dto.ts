import { Rule, RuleType } from '@midwayjs/validate';

/**
 * 订单列表查询 DTO
 */
export class OrderQueryDTO {
  @Rule(RuleType.number().min(1).default(1))
  page: number;

  @Rule(RuleType.number().min(1).max(100).default(10))
  pageSize: number;

  @Rule(RuleType.string().empty('').optional())
  orderType?: string;

  @Rule(RuleType.string().empty('').optional())
  status?: string;
}
