import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../entity/item';

@Provide()
export class CartService extends BaseService {
  @InjectEntityModel(CartItemEntity)
  cartItemEntity: Repository<CartItemEntity>;
}
