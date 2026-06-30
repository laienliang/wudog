import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_merchant_application')
export class MerchantApplication extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 50, comment: '申请入驻模块' })
  module: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'text', nullable: true, comment: '资质材料 JSON' })
  credentials: string;

  @Column({ type: 'tinyint', default: 0, comment: '0待审核 1已通过 2已驳回' })
  status: number;

  @Column({ name: 'reviewer_id', nullable: true })
  reviewerId: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '驳回原因' })
  rejectReason: string;

  @Column({ name: 'reviewed_at', type: 'datetime', nullable: true })
  reviewedAt: Date;
}
