import { CoolController, BaseController } from '@cool-midway/core';
import { FoodRestaurantEntity } from '../../entity/restaurant';
import { FoodRestaurantService } from '../../service/restaurant';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FoodRestaurantEntity,
  service: FoodRestaurantService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
    fieldEq: ['merchantId', 'status'],
  },
})
export class AdminFoodRestaurantController extends BaseController {}
