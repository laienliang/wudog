import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_follow')
export class CommunityFollowEntity extends BaseEntity {
  @Index()
  @Column({ comment: '关注者ID', type: 'int' })
  followerId: number;

  @Index()
  @Column({ comment: '被关注者ID', type: 'int' })
  followeeId: number;
}
