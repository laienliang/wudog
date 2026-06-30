import { Provide } from '@midwayjs/core';
import { CoolCache, BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodDishEntity } from '../entity/dish';

@Provide()
export class FoodDishService extends BaseService {
  @InjectEntityModel(FoodDishEntity)
  foodDishEntity: Repository<FoodDishEntity>;

  @CoolCache(30 * 60 * 1000) // 30 分钟缓存
  async list(query?, option?, connectionName?) {
    return super.list(query, option, connectionName);
  }
}
