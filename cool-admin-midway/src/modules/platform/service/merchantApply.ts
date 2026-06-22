import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformMerchantApplyEntity } from '../entity/merchantApply';

/**
 * 商家入驻申请服务
 */
@Provide()
export class PlatformMerchantApplyService extends BaseService {
  @InjectEntityModel(PlatformMerchantApplyEntity)
  platformMerchantApplyEntity: Repository<PlatformMerchantApplyEntity>;
}
