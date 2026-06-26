import { CoolController, BaseController } from '@cool-midway/core';
import { TravelRouteEntity } from '../../entity/route';
import { TravelRouteService } from '../../service/route';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelRouteEntity,
  service: TravelRouteService,
  pageQueryOp: {
    keyWordLikeFields: ['title'],
    fieldEq: ['merchantId', 'status'],
  },
})
export class AdminTravelRouteController extends BaseController {}
