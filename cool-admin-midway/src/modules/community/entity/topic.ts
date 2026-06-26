import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('community_topic')
export class CommunityTopicEntity extends BaseEntity {
  @Column({ comment: '话题名', length: 50 })
  name: string;

  @Column({ comment: '简介', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '图标', length: 200, nullable: true })
  icon: string;

  @Column({ comment: '关注数', default: 0 })
  followers: number;

  @Column({ comment: '游记数', default: 0 })
  articles: number;

  @Column({ comment: '是否推荐 0=否 1=是', default: 0 })
  isRecommended: number;
}
