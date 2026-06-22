import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('refund_record')
export class RefundRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '支付流水号', length: 64, nullable: true })
  transactionId: string;

  @Column({ comment: '退款金额', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ comment: '退款原因', length: 200, nullable: true })
  reason: string;

  @Column({ comment: '状态 0=申请中 1=已退款 2=拒绝退款', type: 'tinyint', default: 0 })
  status: number;

  @Column({ comment: '退款时间', type: 'datetime', nullable: true })
  refundTime: Date;
}
