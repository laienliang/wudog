import { CoolController, BaseController } from '@cool-midway/core';
import { FoodDishEntity } from '../../entity/dish';
import { FoodDishService } from '../../service/dish';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FoodDishEntity,
  service: FoodDishService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['restaurantId'],
  },
})
export class AdminFoodDishController extends BaseController {}
