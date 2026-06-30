import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_operation_log')
export class OperationLog extends BaseEntity {
  @Column({ name: 'admin_id' })
  adminId: number;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  target: string;

  @Column({ name: 'target_id', nullable: true })
  targetId: number;

  @Column({ type: 'text', nullable: true, comment: '操作详情' })
  detail: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '操作IP' })
  ip: string;
}
