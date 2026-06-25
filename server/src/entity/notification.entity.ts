import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: ['system', 'order', 'interact', 'merchant'] })
  type: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'tinyint', default: 0 })
  is_read: number;

  @Column({ nullable: true })
  ref_id: number;

  @Column({ length: 30, nullable: true })
  ref_type: string;

  @CreateDateColumn()
  created_at: Date;
}
