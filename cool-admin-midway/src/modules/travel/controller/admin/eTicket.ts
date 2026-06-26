import { CoolController, BaseController } from '@cool-midway/core';
import { TravelETicketEntity } from '../../entity/eTicket';
import { TravelETicketService } from '../../service/eTicket';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelETicketEntity,
  service: TravelETicketService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo'],
    fieldEq: ['status'],
  },
})
export class AdminTravelETicketController extends BaseController {}
