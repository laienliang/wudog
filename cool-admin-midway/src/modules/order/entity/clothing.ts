import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('order_clothing')
export class OrderClothingEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '商品ID', type: 'int' })
  goodsId: number;

  @Column({ comment: '商品标题', length: 100 })
  goodsTitle: string;

  @Column({ comment: 'SKU ID', type: 'int', nullable: true })
  skuId: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
