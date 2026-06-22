import { CoolController, BaseController } from '@cool-midway/core';
import { PlatformStatEntity } from '../../entity/stat';
import { PlatformStatService } from '../../service/stat';

/**
 * 统计数据
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PlatformStatEntity,
  service: PlatformStatService,
})
export class AdminPlatformStatController extends BaseController {}
