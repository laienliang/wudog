import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityCommentEntity } from '../../entity/comment';
import { CommunityCommentService } from '../../service/comment';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityCommentEntity,
  service: CommunityCommentService,
  pageQueryOp: {
    keyWordLikeFields: ['content'],
    fieldEq: ['articleId', 'userId', 'parentId', 'replyUserId'],
  },
})
export class AdminCommunityCommentController extends BaseController {}
