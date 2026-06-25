import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  order_no: string;

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: ['product', 'restaurant', 'homestay', 'ticket', 'tour'] })
  type: string;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'confirmed', 'shipped', 'completed', 'cancelled', 'refunding', 'refunded'], default: 'pending' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pay_amount: number;

  @Column({ type: 'json', nullable: true })
  address_snapshot: any;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ type: 'datetime', nullable: true })
  pay_time: Date;

  @Column({ type: 'datetime', nullable: true })
  cancel_time: Date;

  @Column({ type: 'datetime', nullable: true })
  finish_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_deleted: number;
}
