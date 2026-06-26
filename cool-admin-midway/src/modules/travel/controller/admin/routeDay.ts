import { CoolController, BaseController } from '@cool-midway/core';
import { TravelRouteDayEntity } from '../../entity/routeDay';
import { TravelRouteDayService } from '../../service/routeDay';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelRouteDayEntity,
  service: TravelRouteDayService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['routeId'],
  },
})
export class AdminTravelRouteDayController extends BaseController {}
