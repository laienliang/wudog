import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityTagEntity } from '../../entity/tag';
import { CommunityTagService } from '../../service/tag';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityTagEntity,
  service: CommunityTagService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: [],
  },
})
export class AdminCommunityTagController extends BaseController {}
