import { CoolController, BaseController } from '@cool-midway/core';
import { TravelGuideEntity } from '../../entity/guide';
import { TravelGuideService } from '../../service/guide';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelGuideEntity,
  service: TravelGuideService,
  pageQueryOp: {
    keyWordLikeFields: ['title', 'departure'],
    fieldEq: [],
  },
})
export class AdminTravelGuideController extends BaseController {}
