import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodCollectEntity } from '../entity/collect';

@Provide()
export class FoodCollectService extends BaseService {
  @InjectEntityModel(FoodCollectEntity)
  foodCollectEntity: Repository<FoodCollectEntity>;
}
