import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityImageEntity } from '../../entity/image';
import { CommunityImageService } from '../../service/image';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CommunityImageEntity,
  service: CommunityImageService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['articleId', 'sort'],
  },
})
export class AdminCommunityImageController extends BaseController {}
