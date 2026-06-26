import { CoolController, BaseController } from '@cool-midway/core';
import { TravelReviewEntity } from '../../entity/review';
import { TravelReviewService } from '../../service/review';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelReviewEntity,
  service: TravelReviewService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['orderId', 'targetId', 'userId', 'rating'],
  },
})
export class AdminTravelReviewController extends BaseController {}
