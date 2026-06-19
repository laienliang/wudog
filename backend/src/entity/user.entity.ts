import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user', comment: '统一用户表（游客/注册用户）' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '微信openid' })
  openid: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '用户名' })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '密码（bcrypt加密）' })
  password_hash: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ type: 'tinyint', default: 0, comment: '性别：0-未知 1-男 2-女' })
  gender: number;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '地区' })
  region: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '个人简介' })
  bio: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1-正常 0-封禁' })
  status: number;

  @Column({ type: 'datetime', nullable: true, comment: '最后登录时间' })
  last_login_at: Date;

  @Column({ type: 'int', default: 0, comment: '连续登录失败次数' })
  login_fail_count: number;

  @Column({ type: 'datetime', nullable: true, comment: '锁定截止时间' })
  locked_until: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '软删除标记' })
  is_deleted: number;
}
