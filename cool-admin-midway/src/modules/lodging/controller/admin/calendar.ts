import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingCalendarEntity } from '../../entity/calendar';
import { LodgingCalendarService } from '../../service/calendar';

@CoolController({
  prefix: '/admin/lodging/calendar',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LodgingCalendarEntity,
  service: LodgingCalendarService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['roomTypeId', 'isAvailable'],
  },
})
export class AdminLodgingCalendarController extends BaseController {}
