import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityImageEntity } from '../entity/image';

@Provide()
export class CommunityImageService extends BaseService {
  @InjectEntityModel(CommunityImageEntity)
  communityImageEntity: Repository<CommunityImageEntity>;
}
