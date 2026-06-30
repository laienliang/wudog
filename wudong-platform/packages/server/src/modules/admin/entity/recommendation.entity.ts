import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_recommendation')
export class Recommendation extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'content_type', type: 'varchar', length: 50, comment: 'product/restaurant/homestay/route/travelogue' })
  contentType: string;

  @Column({ name: 'content_id' })
  contentId: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1, comment: '0隐藏 1显示' })
  status: number;
}
