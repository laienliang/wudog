import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LodgingReviewEntity } from '../entity/review';

@Provide()
export class LodgingReviewService extends BaseService {
  @InjectEntityModel(LodgingReviewEntity)
  lodgingReviewEntity: Repository<LodgingReviewEntity>;
}
