import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'role_permission', comment: '角色-权限关联表' })
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '角色ID' })
  role_id: number;

  @Column({ type: 'int', comment: '权限ID' })
  permission_id: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
