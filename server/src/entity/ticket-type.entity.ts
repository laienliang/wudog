import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ticket_types')
export class TicketType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'spot_id', type: 'int', comment: '景区ID' })
  spotId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '售价' })
  price: number;

  @Column({ type: 'int', default: -1, comment: '库存 -1表示不限' })
  stock: number;

  @Column({ name: 'valid_days', type: 'int', default: 1, comment: '有效期(天)' })
  validDays: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '票种说明' })
  description: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
