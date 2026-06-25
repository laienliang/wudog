import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 64, name: 'order_no', comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'accommodation_id', comment: '住宿ID' })
  accommodationId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'room_id', comment: '房型ID' })
  roomId: number;

  @Column({ type: 'date', name: 'check_in_date', comment: '入住日期' })
  checkInDate: string;

  @Column({ type: 'date', name: 'check_out_date', comment: '退房日期' })
  checkOutDate: string;

  @Column({ type: 'int', default: 1, comment: '入住晚数' })
  nights: number;

  @Column({ type: 'int', default: 1, comment: '入住人数' })
  guests: number;

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'guest_name', comment: '入住人姓名' })
  guestName: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'guest_phone', comment: '入住人手机' })
  guestPhone: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price', default: 0, comment: '订单总价' })
  totalPrice: number;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '备注' })
  remark: string;

  @Column({ type: 'tinyint', default: 0, comment: '状态:0待支付 1已支付 2已取消 3已完成 4已退款' })
  status: number;

  @Column({ type: 'varchar', length: 512, nullable: true, name: 'cancel_policy', comment: '退订政策说明（预留字段）' })
  cancelPolicy: string;

  @Column({ type: 'datetime', nullable: true, name: 'cancel_deadline', comment: '最晚免费取消时间（预留字段）' })
  cancelDeadline: Date;
}
