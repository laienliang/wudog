import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_travel_ticket_type')
export class TicketType extends BaseEntity {
  @Column({ name: 'scenic_id' })
  scenicId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  stock: number;

  @Column({ name: 'valid_days', nullable: true })
  validDays: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'tinyint', default: 1, comment: '0下架 1上架' })
  status: number;
}
