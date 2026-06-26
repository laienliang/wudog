import { CoolController, BaseController } from '@cool-midway/core';
import { TravelTicketTypeEntity } from '../../entity/ticketType';
import { TravelTicketTypeService } from '../../service/ticketType';

/**
 * 票种公开接口
 */
@CoolController({
  api: ['page', 'info', 'list'],
  entity: TravelTicketTypeEntity,
  service: TravelTicketTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['scenicId'],
  },
})
export class OpenTravelTicketTypeController extends BaseController {}
