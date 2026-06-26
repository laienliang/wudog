import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_like')
export class CommunityLikeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '目标类型 1=游记 2=评论', type: 'tinyint' })
  targetType: number;

  @Index()
  @Column({ comment: '目标ID', type: 'int' })
  targetId: number;
}
