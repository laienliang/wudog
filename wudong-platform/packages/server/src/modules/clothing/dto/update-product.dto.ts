import { Rule, RuleType } from '@midwayjs/validate';

export class UpdateProductDTO {
  @Rule(RuleType.string().max(200).empty(''))
  name?: string;

  @Rule(RuleType.string().max(500).empty(''))
  subtitle?: string;

  @Rule(RuleType.number().optional())
  categoryId?: number;

  @Rule(RuleType.string().max(500).empty(''))
  mainImage?: string;

  @Rule(RuleType.number().min(0).optional())
  price?: number;

  @Rule(RuleType.number().min(0).optional())
  marketPrice?: number;

  @Rule(RuleType.string().empty(''))
  description?: string;

  @Rule(RuleType.string().empty(''))
  craftDescription?: string;

  @Rule(RuleType.number().valid(0, 1).optional())
  status?: number;

  @Rule(RuleType.string().empty('').max(100).optional())
  productCode?: string;

  @Rule(RuleType.number().min(0).optional())
  stock?: number;

  @Rule(RuleType.number().min(0).optional())
  sales?: number;

  @Rule(RuleType.number().min(0).max(5).optional())
  rating?: number;
}
