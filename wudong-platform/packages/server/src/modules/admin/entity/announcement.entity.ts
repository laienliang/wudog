import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_announcement')
export class Announcement extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'tinyint', default: 1, comment: '0草稿 1已发布' })
  status: number;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date;
}
