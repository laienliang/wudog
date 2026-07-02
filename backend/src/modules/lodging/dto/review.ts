// ============================================================
// 评价 DTO
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\review.ts
// ============================================================
import { Rule, RuleType } from '@midwayjs/validate';

export class ReviewListDTO {
  @Rule(RuleType.number().integer().min(1).default(1))
  page: number;

  @Rule(RuleType.number().integer().min(1).max(100).default(20))
  pageSize: number;

  @Rule(RuleType.number().integer().optional())
  homestay_id?: number;
}

export class ReviewCreateDTO {
  @Rule(RuleType.number().integer().required())
  order_id: number;

  @Rule(RuleType.number().integer().required())
  homestay_id: number;

  @Rule(RuleType.number().integer().min(1).max(5).required())
  rating: number;

  @Rule(RuleType.string().optional().allow(''))
  content?: string;

  @Rule(RuleType.array().items(RuleType.string()).optional())
  images?: string[];
}

export class ReviewReplyDTO {
  @Rule(RuleType.string().required())
  owner_reply: string;
}
