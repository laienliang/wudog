import { Rule, RuleType } from '@midwayjs/validate';

export class CreateProductDTO {
  @Rule(RuleType.string().required().max(200))
  name: string;

  @Rule(RuleType.string().max(500).empty(''))
  subtitle?: string;

  @Rule(RuleType.number().required())
  categoryId: number;

  @Rule(RuleType.string().required().max(500))
  mainImage: string;

  @Rule(RuleType.number().required().min(0))
  price: number;

  @Rule(RuleType.number().min(0).empty(0))
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
