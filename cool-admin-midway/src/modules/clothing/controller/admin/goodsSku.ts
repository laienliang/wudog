import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingGoodsSkuEntity } from '../../entity/goodsSku';
import { ClothingGoodsSkuService } from '../../service/goodsSku';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ClothingGoodsSkuEntity,
  service: ClothingGoodsSkuService,
  pageQueryOp: { fieldEq: ['goodsId'] },
})
export class AdminClothingGoodsSkuController extends BaseController {}
