import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelETicketEntity } from '../entity/eTicket';

@Provide()
export class TravelETicketService extends BaseService {
  @InjectEntityModel(TravelETicketEntity)
  travelETicketEntity: Repository<TravelETicketEntity>;
}
