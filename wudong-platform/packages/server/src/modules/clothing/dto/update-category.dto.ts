import { Rule, RuleType } from '@midwayjs/validate';

export class UpdateCategoryDTO {
  @Rule(RuleType.string().min(1).max(50))
  name?: string;

  @Rule(RuleType.number())
  parentId?: number;

  @Rule(RuleType.number())
  sortOrder?: number;

  @Rule(RuleType.string().empty('').max(500))
  icon?: string;
}
