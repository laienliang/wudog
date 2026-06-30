import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodRestaurantEntity } from '../entity/restaurant';

@Provide()
export class FoodRestaurantService extends BaseService {
  @InjectEntityModel(FoodRestaurantEntity)
  foodRestaurantEntity: Repository<FoodRestaurantEntity>;
}
