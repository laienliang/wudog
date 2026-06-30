import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_activity_banner')
export class ActivityBanner extends BaseEntity {
  @Column({ type: 'varchar', length: 200 }) title: string;
  @Column({ name: 'image_url', type: 'varchar', length: 500 }) imageUrl: string;
  @Column({ name: 'link_url', type: 'varchar', length: 500, nullable: true }) linkUrl: string;
  @Column({ name: 'start_date', type: 'date', nullable: true }) startDate: string;
  @Column({ name: 'end_date', type: 'date', nullable: true }) endDate: string;
  @Column({ name: 'sort_order', default: 0 }) sortOrder: number;
  @Column({ type: 'tinyint', default: 1, comment: '0下架 1上架' }) status: number;
}
