import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_collect')
export class CommunityCollectEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Index()
  @Column({ comment: '游记ID', type: 'int' })
  articleId: number;
}
