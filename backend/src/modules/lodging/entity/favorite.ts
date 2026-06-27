// ============================================================
// 民宿收藏实体
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\favorite.ts
// ============================================================
import {
  Entity,
  Column,
  Index,
  Unique,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('favorite')
@Unique('uk_user_homestay', ['user_id', 'homestay_id'])
export class Favorite {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, comment: '用户ID' })
  user_id: number;

  @Index()
  @Column({ type: 'bigint', unsigned: true, comment: '民宿ID' })
  homestay_id: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updated_at: Date;

  @Index()
  @Column({ type: 'tinyint', width: 1, default: 0, comment: '软删除' })
  is_deleted: number;
}
