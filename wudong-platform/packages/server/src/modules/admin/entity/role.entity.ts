import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin_role')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'simple-json', nullable: true, comment: '权限标识列表 ["user:list", "order:edit"]' })
  permissions: string[];
}
