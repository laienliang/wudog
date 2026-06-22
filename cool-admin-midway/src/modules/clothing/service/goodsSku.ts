import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingGoodsSkuEntity } from '../entity/goodsSku';

@Provide()
export class ClothingGoodsSkuService extends BaseService {
  @InjectEntityModel(ClothingGoodsSkuEntity)
  clothingGoodsSkuEntity: Repository<ClothingGoodsSkuEntity>;
}
