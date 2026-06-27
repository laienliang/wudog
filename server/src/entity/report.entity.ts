import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reporter_id' })
  reporterId: number;

  @Column({ name: 'target_type', length: 20 })
  targetType: string;

  @Column({ name: 'target_id' })
  targetId: number;

  @Column({ length: 500 })
  reason: string;

  @Column({ type: 'enum', enum: ['pending', 'handled', 'dismissed'], default: 'pending' })
  status: string;

  @Column({ name: 'handle_result', length: 500, nullable: true })
  handleResult: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'handled_at', nullable: true })
  handledAt: Date;
}
