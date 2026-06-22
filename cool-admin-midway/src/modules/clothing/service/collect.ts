import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingCollectEntity } from '../entity/collect';

@Provide()
export class ClothingCollectService extends BaseService {
  @InjectEntityModel(ClothingCollectEntity)
  clothingCollectEntity: Repository<ClothingCollectEntity>;
}
