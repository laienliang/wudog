import { CoolController, BaseController } from '@cool-midway/core';
import { TravelTicketTypeEntity } from '../../entity/ticketType';
import { TravelTicketTypeService } from '../../service/ticketType';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelTicketTypeEntity,
  service: TravelTicketTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['scenicId'],
  },
})
export class AdminTravelTicketTypeController extends BaseController {}
