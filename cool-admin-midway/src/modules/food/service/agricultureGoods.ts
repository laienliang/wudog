import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FoodAgricultureGoodsEntity } from '../entity/agricultureGoods';

@Provide()
export class FoodAgricultureGoodsService extends BaseService {
  @InjectEntityModel(FoodAgricultureGoodsEntity)
  foodAgricultureGoodsEntity: Repository<FoodAgricultureGoodsEntity>;
}
