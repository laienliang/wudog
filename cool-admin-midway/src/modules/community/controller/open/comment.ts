import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityCommentEntity } from '../../entity/comment';
import { CommunityCommentService } from '../../service/comment';

@CoolController({
  api: ['page', 'add'],
  entity: CommunityCommentEntity,
  service: CommunityCommentService,
  pageQueryOp: {
    keyWordLikeFields: ['content'],
    fieldEq: ['articleId', 'userId'],
  },
})
export class OpenCommunityCommentController extends BaseController {}
