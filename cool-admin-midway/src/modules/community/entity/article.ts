import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_article')
export class CommunityArticleEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '文字内容', type: 'text' })
  content: string;

  @Column({ comment: '图片列表', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '视频URL', length: 500, nullable: true })
  videoUrl: string;

  @Column({ comment: '话题ID列表', type: 'json', nullable: true })
  topicIds: number[];

  @Column({ comment: '关联地点类型 1=餐厅 2=民宿 3=景区', type: 'tinyint', nullable: true })
  relatedPlaceType: number;

  @Column({ comment: '关联地点ID', type: 'int', nullable: true })
  relatedPlaceId: number;

  @Column({ comment: '点赞数', default: 0 })
  likes: number;

  @Column({ comment: '评论数', default: 0 })
  comments: number;

  @Column({ comment: '收藏数', default: 0 })
  collects: number;

  @Column({ comment: '浏览数', default: 0 })
  views: number;

  @Column({ comment: '状态 0=待审核 1=正常 2=已下架', default: 0 })
  status: number;
}
