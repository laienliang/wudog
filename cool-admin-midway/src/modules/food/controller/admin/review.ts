import { CoolController, BaseController } from '@cool-midway/core';
import { FoodReviewEntity } from '../../entity/review';
import { FoodReviewService } from '../../service/review';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FoodReviewEntity,
  service: FoodReviewService,
  pageQueryOp: {
    fieldEq: ['restaurantId', 'goodsId', 'userId'],
  },
})
export class AdminFoodReviewController extends BaseController {}
