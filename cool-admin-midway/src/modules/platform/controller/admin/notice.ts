import { CoolController, BaseController } from '@cool-midway/core';
import { PlatformNoticeEntity } from '../../entity/notice';
import { PlatformNoticeService } from '../../service/notice';

/**
 * 公告
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PlatformNoticeEntity,
  service: PlatformNoticeService,
  listQueryOp: {
    addOrderBy: {
      sort: 'ASC',
    },
  },
})
export class AdminPlatformNoticeController extends BaseController {}
