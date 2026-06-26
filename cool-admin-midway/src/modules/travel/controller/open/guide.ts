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
    // page 和 list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenTravelGuideController extends BaseController {}
