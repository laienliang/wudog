// ============================================================
// 入住须知实体
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\house-rule.ts
// ============================================================
import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Homestay } from './homestay';
import { CancellationRule } from '../../../interface';

@Entity('checkin_notice')
export class HouseRule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, comment: '民宿ID', unique: true })
  homestay_id: number;

  @Column({ type: 'varchar', length: 10, default: '14:00', comment: '入住时间' })
  check_in_time: string;

  @Column({ type: 'varchar', length: 10, default: '12:00', comment: '退房时间' })
  check_out_time: string;

  @Column({ type: 'json', nullable: true, comment: '阶梯退改规则' })
  cancellation_rules: CancellationRule[];

  @Column({ type: 'text', nullable: true, comment: '注意事项' })
  notes: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @Index()
  @Column({ type: 'tinyint', width: 1, default: 0, comment: '软删除' })
  is_deleted: number;

  // ---- 关联 ----
  @ManyToOne(() => Homestay, (h) => h.house_rules)
  @JoinColumn({ name: 'homestay_id' })
  homestay: Homestay;
}
