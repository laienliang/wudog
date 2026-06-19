import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'activity_banner', comment: '活动横幅表' })
export class ActivityBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, comment: '横幅标题' })
  title: string;

  @Column({ type: 'varchar', length: 500, comment: '图片URL' })
  image_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '跳转链接' })
  link_url: string;

  @Column({ type: 'datetime', nullable: true, comment: '起始时间' })
  start_time: Date;

  @Column({ type: 'datetime', nullable: true, comment: '结束时间' })
  end_time: Date;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-启用 0-禁用' })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
