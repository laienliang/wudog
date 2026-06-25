import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 64, comment: '用户名' })
  username: string;

  @Column({ type: 'varchar', length: 128, comment: '密码(加密)' })
  password: string;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ type: 'tinyint', default: 0, comment: '性别:0未知 1男 2女' })
  gender: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态:0禁用 1启用' })
  status: number;
}
