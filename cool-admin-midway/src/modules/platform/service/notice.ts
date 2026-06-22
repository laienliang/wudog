import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformNoticeEntity } from '../entity/notice';

/**
 * 公告服务
 */
@Provide()
export class PlatformNoticeService extends BaseService {
  @InjectEntityModel(PlatformNoticeEntity)
  platformNoticeEntity: Repository<PlatformNoticeEntity>;
}
