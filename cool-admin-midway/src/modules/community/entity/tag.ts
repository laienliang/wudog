import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('community_tag')
export class CommunityTagEntity extends BaseEntity {
  @Column({ comment: '标签名', length: 50 })
  name: string;
}
