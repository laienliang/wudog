import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_travel_e_ticket')
export class ETicket extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'ticket_code', type: 'varchar', length: 100 })
  ticketCode: string;

  @Column({ type: 'tinyint', default: 0, comment: '0未使用 1已核销 2已过期' })
  status: number;

  @Column({ name: 'used_at', type: 'datetime', nullable: true })
  usedAt: Date;
}
