import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityArticleEntity } from '../../entity/article';
import { CommunityArticleService } from '../../service/article';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityArticleEntity,
  service: CommunityArticleService,
  pageQueryOp: {
    keyWordLikeFields: ['title'],
    fieldEq: ['userId', 'status', 'likes', 'comments', 'collects', 'views'],
  },
})
export class AdminCommunityArticleController extends BaseController {}
