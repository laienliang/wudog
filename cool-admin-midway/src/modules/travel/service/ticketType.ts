import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelTicketTypeEntity } from '../entity/ticketType';

@Provide()
export class TravelTicketTypeService extends BaseService {
  @InjectEntityModel(TravelTicketTypeEntity)
  travelTicketTypeEntity: Repository<TravelTicketTypeEntity>;
}
