import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityLikeEntity } from '../../entity/like';
import { CommunityLikeService } from '../../service/like';

@CoolController({
  api: ['add', 'delete'],
  entity: CommunityLikeEntity,
  service: CommunityLikeService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['userId', 'targetType', 'targetId'],
  },
})
export class OpenCommunityLikeController extends BaseController {}
