import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'permission', comment: '权限表' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, comment: '权限名称' })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '权限编码（如 product:manage）' })
  code: string;

  @Column({ type: 'varchar', length: 20, default: 'menu', comment: '权限类型：menu-菜单 button-按钮 api-接口' })
  type: string;

  @Column({ type: 'int', default: 0, comment: '父权限ID（0为顶级）' })
  parent_id: number;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '前端路由路径' })
  path: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '图标' })
  icon: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort_order: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-启用 0-禁用' })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
