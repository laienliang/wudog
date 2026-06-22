import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingReviewEntity } from '../../entity/review';
import { ClothingReviewService } from '../../service/review';

@CoolController({
  api: ['page', 'info'],
  entity: ClothingReviewEntity,
  service: ClothingReviewService,
  pageQueryOp: { fieldEq: ['goodsId'] },
})
export class OpenClothingReviewController extends BaseController {}
