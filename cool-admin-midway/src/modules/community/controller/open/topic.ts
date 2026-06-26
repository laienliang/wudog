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
    // page 接口添加 1 小时缓存（话题相对稳定）
    cache: 60 * 60,
  },
})
export class OpenCommunityTopicController extends BaseController {}
