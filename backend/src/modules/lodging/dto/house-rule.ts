// ============================================================
// 入住须知 DTO
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\house-rule.ts
// ============================================================
import { Rule, RuleType } from '@midwayjs/validate';

export class HouseRuleSaveDTO {
  @Rule(RuleType.number().optional())
  id?: number;

  @Rule(RuleType.number().integer().required())
  homestay_id: number;

  @Rule(RuleType.string().optional().default('14:00'))
  check_in_time: string;

  @Rule(RuleType.string().optional().default('12:00'))
  check_out_time: string;

  @Rule(RuleType.array().items(
    RuleType.object().keys({
      daysBefore: RuleType.number().integer().required(),
      refundPercent: RuleType.number().integer().min(0).max(100).required(),
      description: RuleType.string().required(),
    })
  ).optional())
  cancellation_rules?: Array<{
    daysBefore: number;
    refundPercent: number;
    description: string;
  }>;

  @Rule(RuleType.string().optional().allow(''))
  notes?: string;
}
