import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformSensitiveWordEntity } from '../entity/sensitiveWord';

/**
 * 敏感词服务
 */
@Provide()
export class PlatformSensitiveWordService extends BaseService {
  @InjectEntityModel(PlatformSensitiveWordEntity)
  platformSensitiveWordEntity: Repository<PlatformSensitiveWordEntity>;
}
