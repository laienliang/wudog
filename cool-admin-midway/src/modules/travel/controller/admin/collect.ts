import { CoolController, BaseController } from '@cool-midway/core';
import { TravelCollectEntity } from '../../entity/collect';
import { TravelCollectService } from '../../service/collect';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelCollectEntity,
  service: TravelCollectService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['userId', 'targetType', 'targetId'],
  },
})
export class AdminTravelCollectController extends BaseController {}
