import { CoolController, BaseController } from '@cool-midway/core';
import { FoodAgricultureGoodsEntity } from '../../entity/agricultureGoods';
import { FoodAgricultureGoodsService } from '../../service/agricultureGoods';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FoodAgricultureGoodsEntity,
  service: FoodAgricultureGoodsService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['categoryId', 'merchantId', 'status'],
  },
})
export class AdminFoodAgricultureGoodsController extends BaseController {}
