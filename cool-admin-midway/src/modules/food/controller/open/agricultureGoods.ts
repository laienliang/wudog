import { CoolController, BaseController } from '@cool-midway/core';
import { FoodAgricultureGoodsEntity } from '../../entity/agricultureGoods';
import { FoodAgricultureGoodsService } from '../../service/agricultureGoods';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: FoodAgricultureGoodsEntity,
  service: FoodAgricultureGoodsService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['categoryId', 'status'],
    // page 和 list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenFoodAgricultureGoodsController extends BaseController {}
