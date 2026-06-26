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
})
export class OpenFoodDishController extends BaseController {}
