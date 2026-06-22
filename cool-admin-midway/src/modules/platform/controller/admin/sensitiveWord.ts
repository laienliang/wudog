import { CoolController, BaseController } from '@cool-midway/core';
import { PlatformSensitiveWordEntity } from '../../entity/sensitiveWord';
import { PlatformSensitiveWordService } from '../../service/sensitiveWord';

/**
 * 敏感词
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PlatformSensitiveWordEntity,
  service: PlatformSensitiveWordService,
})
export class AdminPlatformSensitiveWordController extends BaseController {}
