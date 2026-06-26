import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelRouteDayEntity } from '../entity/routeDay';

@Provide()
export class TravelRouteDayService extends BaseService {
  @InjectEntityModel(TravelRouteDayEntity)
  travelRouteDayEntity: Repository<TravelRouteDayEntity>;
}
