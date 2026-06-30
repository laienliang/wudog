import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_community_report')
export class Report extends BaseEntity {
  @Column({ name: 'user_id' }) userId: number;
  @Column({ name: 'target_type', type: 'varchar', length: 50 }) targetType: string;
  @Column({ name: 'target_id' }) targetId: number;
  @Column({ type: 'varchar', length: 500, nullable: true }) reason: string;
  @Column({ type: 'tinyint', default: 0, comment: '0待处理 1已处理 2驳回' }) status: number;
}
