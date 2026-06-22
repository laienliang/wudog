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
  },
})
export class OpenFoodRestaurantController extends BaseController {}
