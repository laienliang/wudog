import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_community_travelogue')
export class Travelogue extends BaseEntity {
  @Column({ name: 'user_id' }) userId: number;

  @Column({ type: 'varchar', length: 200 }) title: string;

  @Column({ type: 'text', nullable: true }) content: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true }) coverImage: string;

  @Column({ type: 'simple-json', nullable: true }) images: string[];

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true }) videoUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: true }) location: string;

  @Column({ name: 'topic_id', nullable: true }) topicId: number;

  @Column({ type: 'tinyint', default: 0, comment: '0待审 1已发布 2驳回' }) status: number;

  @Column({ name: 'view_count', type: 'int', default: 0 }) viewCount: number;

  @Column({ name: 'like_count', type: 'int', default: 0 }) likeCount: number;

  @Column({ name: 'comment_count', type: 'int', default: 0 }) commentCount: number;

  @Column({ name: 'share_count', type: 'int', default: 0 }) shareCount: number;

  @Column({ name: 'linked_type', type: 'varchar', length: 20, nullable: true }) linkedType: string;

  @Column({ name: 'linked_id', nullable: true }) linkedId: number;
}
