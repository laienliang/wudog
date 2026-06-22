import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('cart_item')
export class CartItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID', type: 'int' })
  goodsId: number;

  @Column({ comment: '商品标题', length: 100 })
  goodsTitle: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: 'SKU ID', type: 'int', nullable: true })
  skuId: number;

  @Column({ comment: 'SKU名称', length: 100, nullable: true })
  skuName: string;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '是否选中 0=否 1=是', default: 1 })
  checked: number;

  @Column({ comment: '来源模块 1=衣 2=食-农产品', type: 'tinyint' })
  moduleType: number;
}
