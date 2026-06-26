import { Provide } from '@midwayjs/core';
import { CoolCache, BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityTopicEntity } from '../entity/topic';

@Provide()
export class CommunityTopicService extends BaseService {
  @InjectEntityModel(CommunityTopicEntity)
  communityTopicEntity: Repository<CommunityTopicEntity>;

  @CoolCache(60 * 60) // 1 小时缓存，话题数据相对稳定
  async page(query?, option?, connectionName?) {
    return super.page(query, option, connectionName);
  }
}
