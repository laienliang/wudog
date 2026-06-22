import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformRecommendEntity } from '../entity/recommend';

/**
 * 推荐位服务
 */
@Provide()
export class PlatformRecommendService extends BaseService {
  @InjectEntityModel(PlatformRecommendEntity)
  platformRecommendEntity: Repository<PlatformRecommendEntity>;
}
