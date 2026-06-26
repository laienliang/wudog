import { CoolController, BaseController } from '@cool-midway/core';
import { TravelRouteEntity } from '../../entity/route';
import { TravelRouteService } from '../../service/route';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: TravelRouteEntity,
  service: TravelRouteService,
  pageQueryOp: {
    keyWordLikeFields: ['title'],
    fieldEq: ['status'],
    // page 和 list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenTravelRouteController extends BaseController {}
