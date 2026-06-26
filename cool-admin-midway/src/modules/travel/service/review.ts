import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelReviewEntity } from '../entity/review';

@Provide()
export class TravelReviewService extends BaseService {
  @InjectEntityModel(TravelReviewEntity)
  travelReviewEntity: Repository<TravelReviewEntity>;
}
