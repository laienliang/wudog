import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingReviewEntity } from '../entity/review';

@Provide()
export class ClothingReviewService extends BaseService {
  @InjectEntityModel(ClothingReviewEntity)
  clothingReviewEntity: Repository<ClothingReviewEntity>;
}
