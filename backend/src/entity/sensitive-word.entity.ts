import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sensitive_word', comment: '敏感词库表' })
export class SensitiveWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '敏感词' })
  word: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '分类' })
  category: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-启用 0-禁用' })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
