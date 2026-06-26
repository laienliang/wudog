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
  },
})
export class OpenFoodAgricultureGoodsController extends BaseController {}
