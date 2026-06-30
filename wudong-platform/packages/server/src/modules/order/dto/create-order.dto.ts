import { Rule, RuleType } from '@midwayjs/validate';

/**
 * 订单明细项 DTO
 */
export class CreateOrderItemDTO {
  @Rule(RuleType.string().required())
  productType: string;

  @Rule(RuleType.number().required())
  productId: number;

  @Rule(RuleType.string().required().max(200))
  productName: string;

  @Rule(RuleType.string().max(500).empty(''))
  productImage?: string;

  @Rule(RuleType.number().optional())
  skuId?: number;

  @Rule(RuleType.string().max(100).empty(''))
  skuName?: string;

  @Rule(RuleType.number().required().min(0))
  unitPrice: number;

  @Rule(RuleType.number().required().min(1))
  quantity: number;
}

/**
 * 创建订单 DTO
 */
export class CreateOrderDTO {
  @Rule(
    RuleType.string()
      .required()
      .valid('clothing', 'food_meal', 'food_product', 'accommodation', 'travel')
  )
  orderType: string;

  @Rule(RuleType.number().required())
  merchantId: number;

  @Rule(RuleType.array().items(RuleType.object()).min(1).required())
  items: CreateOrderItemDTO[];

  @Rule(RuleType.string().max(500).empty(''))
  remark?: string;
}
