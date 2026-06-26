import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityFollowEntity } from '../entity/follow';

@Provide()
export class CommunityFollowService extends BaseService {
  @InjectEntityModel(CommunityFollowEntity)
  communityFollowEntity: Repository<CommunityFollowEntity>;
}
