import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'announcement', comment: '平台公告表' })
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, comment: '公告标题' })
  title: string;

  @Column({ type: 'text', comment: '公告内容' })
  content: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-已发布 0-草稿' })
  status: number;

  @Column({ type: 'datetime', nullable: true, comment: '发布时间' })
  published_at: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
