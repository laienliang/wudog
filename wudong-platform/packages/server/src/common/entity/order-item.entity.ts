import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

/**
 * 订单明细实体 — 映射 wd_order_item 表
 *
 * 注意：该表仅有 id 与 created_at 两个时间字段，
 * 不含 updated_at / deleted_at，因此不继承 BaseEntity。
 *
 * 外键 order_id 仅通过 @ManyToOne + @JoinColumn 管理，
 * 不单独声明 orderId 字段 —— TypeORM 会自动读写该列。
 */
@Entity('wd_order_item')
export class OrderItem {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '主键ID' })
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '创建时间' })
  createdAt: Date;

  /** 所属订单（TypeORM 自动管理 order_id 列） */
  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_type', type: 'varchar', length: 50, comment: '商品类型' })
  productType: string;

  @Column({ name: 'product_id', comment: '商品ID' })
  productId: number;

  @Column({ name: 'product_name', type: 'varchar', length: 200, comment: '商品名称（快照）' })
  productName: string;

  @Column({ name: 'product_image', type: 'varchar', length: 500, nullable: true, comment: '商品图片（快照）' })
  productImage: string;

  @Column({ name: 'sku_id', nullable: true, comment: 'SKU ID' })
  skuId: number;

  @Column({ name: 'sku_name', type: 'varchar', length: 100, nullable: true, comment: 'SKU名称（快照）' })
  skuName: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, comment: '单价（快照）' })
  unitPrice: number;

  @Column({ type: 'int', default: 1, comment: '数量' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '小计 = unitPrice × quantity' })
  subtotal: number;
}
