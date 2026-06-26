import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingGoodsSkuEntity } from '../../entity/goodsSku';
import { ClothingGoodsSkuService } from '../../service/goodsSku';

/**
 * 商品 SKU 公开接口
 */
@CoolController({
  api: ['page', 'info', 'list'],
  entity: ClothingGoodsSkuEntity,
  service: ClothingGoodsSkuService,
  pageQueryOp: { fieldEq: ['goodsId'] },
})
export class OpenClothingGoodsSkuController extends BaseController {}
