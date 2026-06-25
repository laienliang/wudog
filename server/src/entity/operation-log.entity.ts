import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('operation_logs')
export class OperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operator_id: number;

  @Column({ length: 50, nullable: true })
  operator_name: string;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 30, nullable: true })
  target_type: string;

  @Column({ nullable: true })
  target_id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ length: 50, nullable: true })
  ip: string;

  @CreateDateColumn()
  created_at: Date;
}
