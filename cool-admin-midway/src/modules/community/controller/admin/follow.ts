import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityFollowEntity } from '../../entity/follow';
import { CommunityFollowService } from '../../service/follow';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityFollowEntity,
  service: CommunityFollowService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['followerId', 'followeeId'],
  },
})
export class AdminCommunityFollowController extends BaseController {}
