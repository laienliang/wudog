import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LodgingCollectEntity } from '../entity/collect';

@Provide()
export class LodgingCollectService extends BaseService {
  @InjectEntityModel(LodgingCollectEntity)
  lodgingCollectEntity: Repository<LodgingCollectEntity>;
}
