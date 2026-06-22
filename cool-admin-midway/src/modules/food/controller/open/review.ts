import { CoolController, BaseController } from '@cool-midway/core';
import { FoodReviewEntity } from '../../entity/review';
import { FoodReviewService } from '../../service/review';

@CoolController({
  api: ['page', 'info'],
  entity: FoodReviewEntity,
  service: FoodReviewService,
  pageQueryOp: {
    fieldEq: ['restaurantId', 'goodsId'],
  },
})
export class OpenFoodReviewController extends BaseController {}
