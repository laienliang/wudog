import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_system_message')
export class SystemMessage extends BaseEntity {
  @Column({ name: 'user_id', nullable: true, comment: 'null=群发' })
  userId: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'tinyint', default: 0, comment: '0未读 1已读' })
  isRead: number;
}
