import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 公告
 */
@Entity('platform_notice')
export class PlatformNoticeEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '状态 0=隐藏 1=显示', default: 1 })
  status: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
