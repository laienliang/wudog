import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingGoodsEntity } from '../../entity/goods';
import { ClothingGoodsService } from '../../service/goods';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ClothingGoodsEntity,
  service: ClothingGoodsService,
  pageQueryOp: {
    keyWordLikeFields: ['title', 'subtitle'],
    fieldEq: ['status', 'categoryId', 'merchantId'],
  },
})
export class AdminClothingGoodsController extends BaseController {}
