import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_video')
export class CommunityVideoEntity extends BaseEntity {
  @Index()
  @Column({ comment: '游记ID', type: 'int' })
  articleId: number;

  @Column({ comment: '视频URL', length: 500 })
  videoUrl: string;
}
