import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_image')
export class CommunityImageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '游记ID', type: 'int' })
  articleId: number;

  @Column({ comment: '图片URL', length: 500 })
  imageUrl: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
