import { CoolController, BaseController } from '@cool-midway/core';
import { FoodDishEntity } from '../../entity/dish';
import { FoodDishService } from '../../service/dish';

@CoolController({
  api: ['list'],
  entity: FoodDishEntity,
  service: FoodDishService,
  pageQueryOp: {
    fieldEq: ['restaurantId'],
  },
  listQueryOp: {
    // list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenFoodDishController extends BaseController {}
