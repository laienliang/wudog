import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingCollectEntity } from '../../entity/collect';
import { ClothingCollectService } from '../../service/collect';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ClothingCollectEntity,
  service: ClothingCollectService,
  pageQueryOp: { fieldEq: ['userId', 'goodsId'] },
})
export class AdminClothingCollectController extends BaseController {}
