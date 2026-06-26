import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('community_report')
export class CommunityReportEntity extends BaseEntity {
  @Index()
  @Column({ comment: '举报用户ID', type: 'int', nullable: true })
  userId: number;

  @Column({ comment: '目标类型 1=游记 2=评论', type: 'tinyint' })
  targetType: number;

  @Index()
  @Column({ comment: '目标ID', type: 'int' })
  targetId: number;

  @Column({ comment: '举报原因', length: 200 })
  reason: string;

  @Column({ comment: '处理状态 0=待处理 1=已处理 2=驳回', default: 0 })
  status: number;
}
