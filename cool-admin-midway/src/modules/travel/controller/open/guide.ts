import { CoolController, BaseController } from '@cool-midway/core';
import { TravelGuideEntity } from '../../entity/guide';
import { TravelGuideService } from '../../service/guide';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: TravelGuideEntity,
  service: TravelGuideService,
  pageQueryOp: {
    keyWordLikeFields: ['title', 'departure'],
    fieldEq: [],
  },
})
export class OpenTravelGuideController extends BaseController {}
