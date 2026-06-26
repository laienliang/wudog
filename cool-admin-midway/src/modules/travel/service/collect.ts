import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelCollectEntity } from '../entity/collect';

@Provide()
export class TravelCollectService extends BaseService {
  @InjectEntityModel(TravelCollectEntity)
  travelCollectEntity: Repository<TravelCollectEntity>;
}
