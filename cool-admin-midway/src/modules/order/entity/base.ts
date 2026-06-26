import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

@Entity('order_base')
export class OrderBaseEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '模块类型 1=衣 2=食 3=住 4=行', type: 'tinyint' })
  moduleType: number;

  @Column({ comment: '订单总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '实付金额', type: 'decimal', precision: 10, scale: 2 })
  payAmount: number;

  @Column({ comment: '优惠金额', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ comment: '订单状态 0=待支付 1=已支付 2=已确认 3=进行中 4=已完成 5=已取消 6=已退款', type: 'tinyint', default: 0 })
  status: number;

  @Column({ comment: '支付时间', type: 'datetime', nullable: true })
  payTime: Date;

  @Column({ comment: '完成时间', type: 'datetime', nullable: true })
  finishTime: Date;

  @Column({ comment: '取消时间', type: 'datetime', nullable: true })
  cancelTime: Date;

  @Column({ comment: '用户备注', length: 500, nullable: true })
  remark: string;

  @Column({ comment: '订单明细(JSON)', type: 'json', nullable: true })
  items: any[];
}
