import { CoolController, BaseController } from '@cool-midway/core';
import { CartItemEntity } from '../../entity/item';
import { CartService } from '../../service/item';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CartItemEntity,
  service: CartService,
  pageQueryOp: {
    keyWordLikeFields: ['goodsTitle'],
    fieldEq: ['userId', 'moduleType', 'checked'],
  },
})
export class AdminCartItemController extends BaseController {}
