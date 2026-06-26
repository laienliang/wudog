import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityTopicEntity } from '../../entity/topic';
import { CommunityTopicService } from '../../service/topic';

@CoolController({
  api: ['page', 'info'],
  entity: CommunityTopicEntity,
  service: CommunityTopicService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['isRecommended'],
  },
})
export class OpenCommunityTopicController extends BaseController {}
