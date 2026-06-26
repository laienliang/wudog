import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityVideoEntity } from '../entity/video';

@Provide()
export class CommunityVideoService extends BaseService {
  @InjectEntityModel(CommunityVideoEntity)
  communityVideoEntity: Repository<CommunityVideoEntity>;
}
