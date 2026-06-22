import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformStatEntity } from '../entity/stat';

/**
 * 统计数据服务
 */
@Provide()
export class PlatformStatService extends BaseService {
  @InjectEntityModel(PlatformStatEntity)
  platformStatEntity: Repository<PlatformStatEntity>;
}
