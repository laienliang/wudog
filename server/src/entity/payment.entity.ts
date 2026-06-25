import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 20, default: 'wechat' })
  method: string;

  @Column({ length: 64, nullable: true })
  transaction_id: string;

  @Column({ type: 'enum', enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  paid_at: Date;

  @Column({ type: 'datetime', nullable: true })
  refund_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
