import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityVideoEntity } from '../../entity/video';
import { CommunityVideoService } from '../../service/video';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityVideoEntity,
  service: CommunityVideoService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['articleId'],
  },
})
export class AdminCommunityVideoController extends BaseController {}
