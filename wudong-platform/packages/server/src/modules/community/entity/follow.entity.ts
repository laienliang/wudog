import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_community_follow')
export class Follow extends BaseEntity {
  @Column({ name: 'follower_id' }) followerId: number;
  @Column({ name: 'following_id' }) followingId: number;
}
