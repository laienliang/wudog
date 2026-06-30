import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('wd_user')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true, comment: '微信openid' })
  openid: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '微信unionid' })
  unionid: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ type: 'tinyint', default: 0, comment: '性别：0未知 1男 2女' })
  gender: number;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '地区' })
  region: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '个人简介' })
  bio: string;

  @Column({ type: 'varchar', length: 50, default: 'user', comment: '角色：user/merchant/admin' })
  role: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '密码（bcrypt）' })
  password: string;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true, comment: '最后登录时间' })
  lastLoginAt: Date;
}
