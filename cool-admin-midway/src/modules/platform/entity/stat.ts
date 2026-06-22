import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 统计数据
 */
@Entity('platform_stat')
export class PlatformStatEntity extends BaseEntity {
  @Column({ comment: '统计日期', type: 'date' })
  statDate: Date;

  @Column({ comment: '新增用户数', default: 0 })
  newUserCount: number;

  @Column({ comment: '订单数', default: 0 })
  orderCount: number;

  @Column({ comment: 'GMV', type: 'decimal', precision: 12, scale: 2 })
  gmv: number;

  @Column({ comment: '游记发布数', default: 0 })
  articleCount: number;
}
