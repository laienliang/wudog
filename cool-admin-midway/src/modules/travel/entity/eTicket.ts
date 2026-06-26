import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('travel_e_ticket')
export class TravelETicketEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '票种/路线ID', type: 'int' })
  targetId: number;

  @Column({ comment: '二维码', length: 200, nullable: true })
  qrCode: string;

  @Column({ comment: '状态 0=未使用 1=已使用 2=已退款', type: 'tinyint', default: 0 })
  status: number;

  @Column({ comment: '使用日期', type: 'date', nullable: true })
  useDate: Date;

  @Column({ comment: '核销时间', type: 'datetime', nullable: true })
  verifyTime: Date;
}
