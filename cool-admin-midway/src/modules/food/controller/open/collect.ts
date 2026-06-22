import { CoolController, BaseController } from '@cool-midway/core';
import { FoodCollectEntity } from '../../entity/collect';
import { FoodCollectService } from '../../service/collect';

@CoolController({
  api: ['add', 'delete', 'page'],
  entity: FoodCollectEntity,
  service: FoodCollectService,
  pageQueryOp: {
    fieldEq: ['userId', 'targetType'],
  },
})
export class OpenFoodCollectController extends BaseController {}
