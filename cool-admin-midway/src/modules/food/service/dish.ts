import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodDishEntity } from '../entity/dish';

@Provide()
export class FoodDishService extends BaseService {
  @InjectEntityModel(FoodDishEntity)
  foodDishEntity: Repository<FoodDishEntity>;
}
