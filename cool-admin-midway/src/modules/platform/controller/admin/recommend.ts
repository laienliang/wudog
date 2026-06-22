import { CoolController, BaseController } from '@cool-midway/core';
import { PlatformRecommendEntity } from '../../entity/recommend';
import { PlatformRecommendService } from '../../service/recommend';

/**
 * 推荐位
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PlatformRecommendEntity,
  service: PlatformRecommendService,
  listQueryOp: {
    addOrderBy: {
      sort: 'ASC',
    },
  },
})
export class AdminPlatformRecommendController extends BaseController {}
