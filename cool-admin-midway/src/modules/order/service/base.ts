import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OrderBaseEntity } from '../entity/base';

/**
 * 订单服务
 */
@Provide()
export class OrderService extends BaseService {
  @InjectEntityModel(OrderBaseEntity)
  orderBaseEntity: Repository<OrderBaseEntity>;

  @Inject()
  ctx;

  /**
   * 生成唯一订单编号
   */
  async generateOrderNo(): Promise<string> {
    const prefix = 'WD';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  }
}
