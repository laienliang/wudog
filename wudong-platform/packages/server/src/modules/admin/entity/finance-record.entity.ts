import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_finance_record')
export class FinanceRecord extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'platform_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number;

  @Column({ name: 'merchant_income', type: 'decimal', precision: 10, scale: 2, default: 0 })
  merchantIncome: number;

  @Column({ type: 'tinyint', default: 0, comment: '0待结算 1已结算 2已到账' })
  status: number;

  @Column({ name: 'settled_at', type: 'datetime', nullable: true })
  settledAt: Date;
}
