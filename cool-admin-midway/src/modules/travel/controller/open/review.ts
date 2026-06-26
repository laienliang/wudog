import { CoolController, BaseController } from '@cool-midway/core';
import { TravelReviewEntity } from '../../entity/review';
import { TravelReviewService } from '../../service/review';

@CoolController({
  api: ['page', 'info'],
  entity: TravelReviewEntity,
  service: TravelReviewService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['targetId', 'userId'],
  },
})
export class OpenTravelReviewController extends BaseController {}
