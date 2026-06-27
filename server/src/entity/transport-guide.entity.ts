import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transport_guides')
export class TransportGuide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '出发地' })
  departure: string;

  @Column({ type: 'varchar', length: 50, comment: '目的地' })
  destination: string;

  @Column({ name: 'transport_type', type: 'varchar', length: 50, nullable: true, comment: '交通方式' })
  transportType: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '耗时' })
  duration: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '参考费用' })
  cost: string;

  @Column({ type: 'text', nullable: true, comment: '详细说明' })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '攻略图' })
  image: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
