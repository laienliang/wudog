import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('payment_record')
export class PaymentRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index({ unique: true })
  @Column({ comment: '支付流水号', length: 64, nullable: true })
  transactionId: string;

  @Column({ comment: '支付金额', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ comment: '支付方式 1=微信支付', type: 'tinyint', default: 1 })
  payType: number;

  @Column({ comment: '状态 0=待支付 1=已支付 2=支付失败', type: 'tinyint', default: 0 })
  status: number;

  @Column({ comment: '支付时间', type: 'datetime', nullable: true })
  payTime: Date;

  @Column({ comment: '回调数据', type: 'text', nullable: true })
  callbackData: string;
}
