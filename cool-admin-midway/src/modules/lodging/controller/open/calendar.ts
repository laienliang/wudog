import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingCalendarEntity } from '../../entity/calendar';

@CoolController({
  prefix: '/open/lodging/calendar',
  api: ['page'],
  entity: LodgingCalendarEntity,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['roomTypeId', 'isAvailable'],
  },
})
export class OpenLodgingCalendarController extends BaseController {}
