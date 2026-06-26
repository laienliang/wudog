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
    // page 和 list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenClothingGoodsController extends BaseController {}
