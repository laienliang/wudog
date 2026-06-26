import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingReviewEntity } from '../../entity/review';

@CoolController({
  prefix: '/open/lodging/review',
  api: ['page', 'info'],
  entity: LodgingReviewEntity,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['hostelId', 'orderId'],
  },
})
export class OpenLodgingReviewController extends BaseController {}
