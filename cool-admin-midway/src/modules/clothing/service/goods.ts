import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingGoodsEntity } from '../entity/goods';

@Provide()
export class ClothingGoodsService extends BaseService {
  @InjectEntityModel(ClothingGoodsEntity)
  clothingGoodsEntity: Repository<ClothingGoodsEntity>;
}
