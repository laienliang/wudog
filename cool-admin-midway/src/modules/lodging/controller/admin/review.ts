import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingReviewEntity } from '../../entity/review';
import { LodgingReviewService } from '../../service/review';

@CoolController({
  prefix: '/admin/lodging/review',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LodgingReviewEntity,
  service: LodgingReviewService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['orderId', 'hostelId', 'userId', 'rating'],
  },
})
export class AdminLodgingReviewController extends BaseController {}
