import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingReviewEntity } from '../../entity/review';
import { ClothingReviewService } from '../../service/review';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ClothingReviewEntity,
  service: ClothingReviewService,
  pageQueryOp: { fieldEq: ['goodsId', 'userId'] },
})
export class AdminClothingReviewController extends BaseController {}
