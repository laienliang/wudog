import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodReviewEntity } from '../entity/review';

@Provide()
export class FoodReviewService extends BaseService {
  @InjectEntityModel(FoodReviewEntity)
  foodReviewEntity: Repository<FoodReviewEntity>;
}
