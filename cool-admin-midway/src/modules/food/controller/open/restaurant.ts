import { CoolController, BaseController } from '@cool-midway/core';
import { FoodRestaurantEntity } from '../../entity/restaurant';
import { FoodRestaurantService } from '../../service/restaurant';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: FoodRestaurantEntity,
  service: FoodRestaurantService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
    fieldEq: ['status'],
    // page 和 list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenFoodRestaurantController extends BaseController {}
