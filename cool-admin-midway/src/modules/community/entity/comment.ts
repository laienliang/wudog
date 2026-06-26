import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_comment')
export class CommunityCommentEntity extends BaseEntity {
  @Index()
  @Column({ comment: '游记ID', type: 'int' })
  articleId: number;

  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Index()
  @Column({ comment: '父评论ID，0=一级评论', type: 'int', default: 0 })
  parentId: number;

  @Index()
  @Column({ comment: '回复的用户ID', type: 'int', nullable: true })
  replyUserId: number;

  @Column({ comment: '评论内容', length: 500 })
  content: string;
}
