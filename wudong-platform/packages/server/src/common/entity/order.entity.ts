import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderItem } from './order-item.entity';

/**
 * 订单实体 — 映射 wd_order 表
 *
 * 统一订单状态机：
 *   pending_pay → paid → confirmed → completed
 *              ↘ cancelled
 *   completed → refunded
 */
@Entity('wd_order')
export class Order extends BaseEntity {
  @Column({ name: 'order_no', type: 'varchar', length: 64, unique: true, comment: '订单号（雪花ID）' })
  orderNo: string;

  @Column({ name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ name: 'merchant_id', nullable: true, comment: '商家ID' })
  merchantId: number;

  @Column({ name: 'order_type', type: 'varchar', length: 50, comment: '订单类型：clothing/food_meal/food_product/accommodation/travel' })
  orderType: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, comment: '总金额' })
  totalAmount: number;

  @Column({ name: 'pay_amount', type: 'decimal', precision: 10, scale: 2, comment: '实付金额' })
  payAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'pending_pay', comment: '订单状态' })
  status: string;

  @Column({ name: 'pay_type', type: 'varchar', length: 20, nullable: true, comment: '支付方式：wechat/alipay' })
  payType: string;

  @Column({ name: 'pay_time', type: 'datetime', nullable: true, comment: '支付时间' })
  payTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注' })
  remark: string;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];
}
