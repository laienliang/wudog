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
  },
})
export class OpenTravelRouteController extends BaseController {}
