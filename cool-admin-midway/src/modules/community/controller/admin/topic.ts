import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityTopicEntity } from '../../entity/topic';
import { CommunityTopicService } from '../../service/topic';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityTopicEntity,
  service: CommunityTopicService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['isRecommended'],
  },
})
export class AdminCommunityTopicController extends BaseController {}
