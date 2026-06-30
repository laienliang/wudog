import { Rule, RuleType } from '@midwayjs/validate';

export class CreateCategoryDTO {
  @Rule(RuleType.string().required().min(1).max(50))
  name: string;

  @Rule(RuleType.number().default(0))
  parentId?: number;

  @Rule(RuleType.number().default(0))
  sortOrder?: number;

  @Rule(RuleType.string().empty('').max(500))
  icon?: string;
}
