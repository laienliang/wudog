import { CoolController, BaseController } from '@cool-midway/core';
import { PlatformMerchantApplyEntity } from '../../entity/merchantApply';
import { PlatformMerchantApplyService } from '../../service/merchantApply';

/**
 * 商家入驻申请
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PlatformMerchantApplyEntity,
  service: PlatformMerchantApplyService,
})
export class AdminPlatformMerchantApplyController extends BaseController {}
