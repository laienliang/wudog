import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityCollectEntity } from '../../entity/collect';
import { CommunityCollectService } from '../../service/collect';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityCollectEntity,
  service: CommunityCollectService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['userId', 'articleId'],
  },
})
export class AdminCommunityCollectController extends BaseController {}
