import { CoolController, BaseController } from '@cool-midway/core';
import { PlatformBannerEntity } from '../../entity/banner';
import { PlatformBannerService } from '../../service/banner';

/**
 * 轮播图
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PlatformBannerEntity,
  service: PlatformBannerService,
  listQueryOp: {
    addOrderBy: {
      sort: 'ASC',
    },
  },
})
export class AdminPlatformBannerController extends BaseController {}
