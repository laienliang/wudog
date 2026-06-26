import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityCommentEntity } from '../entity/comment';

@Provide()
export class CommunityCommentService extends BaseService {
  @InjectEntityModel(CommunityCommentEntity)
  communityCommentEntity: Repository<CommunityCommentEntity>;
}
