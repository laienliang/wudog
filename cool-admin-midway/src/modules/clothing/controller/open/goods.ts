import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingGoodsEntity } from '../../entity/goods';
import { ClothingGoodsService } from '../../service/goods';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: ClothingGoodsEntity,
  service: ClothingGoodsService,
  pageQueryOp: {
    keyWordLikeFields: ['title', 'subtitle'],
    fieldEq: ['status'],
  },
})
export class OpenClothingGoodsController extends BaseController {}
