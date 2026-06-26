import { CoolController, BaseController } from '@cool-midway/core';
import { TravelETicketEntity } from '../../entity/eTicket';
import { TravelETicketService } from '../../service/eTicket';

@CoolController({
  api: ['info'],
  entity: TravelETicketEntity,
  service: TravelETicketService,
})
export class OpenTravelETicketController extends BaseController {}
