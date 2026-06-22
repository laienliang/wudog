import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodTimeSlotEntity } from '../entity/timeSlot';

@Provide()
export class FoodTimeSlotService extends BaseService {
  @InjectEntityModel(FoodTimeSlotEntity)
  foodTimeSlotEntity: Repository<FoodTimeSlotEntity>;
}
