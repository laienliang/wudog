import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('order_lodging')
export class OrderLodgingEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '民宿ID', type: 'int' })
  hostelId: number;

  @Column({ comment: '民宿名称', length: 100 })
  hostelName: string;

  @Column({ comment: '房型ID', type: 'int' })
  roomTypeId: number;

  @Column({ comment: '房型名', length: 50 })
  roomTypeName: string;

  @Column({ comment: '入住日期', type: 'date' })
  checkInDate: Date;

  @Column({ comment: '离店日期', type: 'date' })
  checkOutDate: Date;

  @Column({ comment: '晚数', default: 1 })
  nights: number;

  @Column({ comment: '人数', default: 1 })
  guestCount: number;

  @Column({ comment: '总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '入住人姓名', length: 50 })
  guestName: string;

  @Column({ comment: '身份证号', length: 20, nullable: true })
  idCard: string;
}
