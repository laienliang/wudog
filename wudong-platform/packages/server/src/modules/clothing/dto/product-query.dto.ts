import { Rule, RuleType } from '@midwayjs/validate';

export class ProductQueryDTO {
  @Rule(RuleType.number().min(1).default(1))
  page: number;

  @Rule(RuleType.number().min(1).max(100).default(10))
  pageSize: number;

  @Rule(RuleType.number().optional())
  categoryId?: number;

  @Rule(RuleType.string().empty(''))
  keyword?: string;

  @Rule(RuleType.string().empty(''))
  sortField?: string;

  @Rule(RuleType.string().valid('ASC', 'DESC').default('DESC'))
  sortOrder: 'ASC' | 'DESC';

  @Rule(RuleType.number().optional())
  minPrice?: number;

  @Rule(RuleType.number().optional())
  maxPrice?: number;

  @Rule(RuleType.number().optional())
  minRating?: number;
}
