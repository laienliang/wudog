import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order', comment: '统一订单表' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '订单编号' })
  order_no: string;

  @Column({ type: 'varchar', length: 20, comment: '订单类型：product/food_order/stay/ticket/route' })
  order_type: string;

  @Column({ type: 'int', comment: '用户ID' })
  user_id: number;

  @Column({ type: 'int', nullable: true, comment: '商家ID' })
  merchant_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '订单总金额' })
  total_amount: number;

  @Column({ type: 'varchar', length: 30, default: 'pending_payment', comment: '订单状态' })
  status: string;

  @Column({ type: 'datetime', nullable: true, comment: '支付时间' })
  pay_time: Date;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '支付方式' })
  pay_method: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '微信支付交易号' })
  transaction_id: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注' })
  remark: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '退款拒绝原因' })
  refund_reject_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
