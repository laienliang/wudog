import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodAgricultureCategoryEntity } from '../entity/agricultureCategory';

@Provide()
export class FoodAgricultureCategoryService extends BaseService {
  @InjectEntityModel(FoodAgricultureCategoryEntity)
  foodAgricultureCategoryEntity: Repository<FoodAgricultureCategoryEntity>;
}
