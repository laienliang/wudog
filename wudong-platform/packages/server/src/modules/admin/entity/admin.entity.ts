import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity('wd_admin')
export class Admin extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 200, comment: 'bcrypt 加密' })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  realName: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ type: 'tinyint', default: 1, comment: '0禁用 1启用' })
  status: number;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date;
}
