import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityCollectEntity } from '../entity/collect';

@Provide()
export class CommunityCollectService extends BaseService {
  @InjectEntityModel(CommunityCollectEntity)
  communityCollectEntity: Repository<CommunityCollectEntity>;
}
