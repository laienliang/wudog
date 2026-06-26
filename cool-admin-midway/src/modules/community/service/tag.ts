import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityTagEntity } from '../entity/tag';

@Provide()
export class CommunityTagService extends BaseService {
  @InjectEntityModel(CommunityTagEntity)
  communityTagEntity: Repository<CommunityTagEntity>;
}
