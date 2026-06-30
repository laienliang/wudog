import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_merchant')
export class Merchant extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 50, comment: '所属模块 clothing/food/accommodation/travel' })
  module: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'tinyint', default: 0, comment: '0待审核 1已通过 2已驳回 3已封禁' })
  status: number;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date;
}
