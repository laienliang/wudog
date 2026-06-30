import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_community_comment')
export class Comment extends BaseEntity {
  @Column({ name: 'user_id' }) userId: number;

  @Column({ name: 'target_type', type: 'varchar', length: 50 }) targetType: string;

  @Column({ name: 'target_id' }) targetId: number;

  @Column({ name: 'parent_id', nullable: true }) parentId: number;

  @Column({ type: 'text', nullable: true }) content: string;

  @Column({ type: 'text', nullable: true, comment: '管理员回复' })
  reply: string;
}
