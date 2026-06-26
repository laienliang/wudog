import { Provide } from '@midwayjs/core';
import { CoolCache, BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodRestaurantEntity } from '../entity/restaurant';

@Provide()
export class FoodRestaurantService extends BaseService {
  @InjectEntityModel(FoodRestaurantEntity)
  foodRestaurantEntity: Repository<FoodRestaurantEntity>;

  @CoolCache(30 * 60) // 30 分钟缓存
  async list(query?, option?, connectionName?) {
    return super.list(query, option, connectionName);
  }

  @CoolCache(30 * 60) // 30 分钟缓存
  async page(query?, option?, connectionName?) {
    return super.page(query, option, connectionName);
  }

  @CoolCache(30 * 60) // 30 分钟缓存
  async info(id, infoIgnoreProperty?) {
    return super.info(id, infoIgnoreProperty);
  }
}
