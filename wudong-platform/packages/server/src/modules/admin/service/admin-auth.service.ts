import { Provide, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Admin } from '../entity/admin.entity';

@Provide()
export class AdminAuthService {
  @InjectEntityModel(Admin)
  adminModel: Repository<Admin>;

  @Config('jwt.secret')
  jwtSecret: string;

  async login(username: string, password: string) {
    const admin = await this.adminModel.findOne({ where: { username } });
    if (!admin) throw new Error('账号或密码错误');
    if (admin.status === 0) throw new Error('账号已被禁用');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error('账号或密码错误');

    const accessToken = jwt.sign(
      { adminId: admin.id, roleId: admin.roleId, type: 'admin' },
      this.jwtSecret,
      { expiresIn: '7d' },
    );
    const refreshToken = jwt.sign(
      { adminId: admin.id, type: 'admin_refresh' },
      this.jwtSecret,
      { expiresIn: '30d' },
    );

    await this.adminModel.update(admin.id, { lastLoginAt: new Date() } as any);

    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        username: admin.username,
        realName: admin.realName,
        roleId: admin.roleId,
      },
    };
  }

  async refresh(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, this.jwtSecret) as {
      adminId: number;
      type: string;
    };
    if (decoded.type !== 'admin_refresh') throw new Error('无效的刷新令牌');
    const admin = await this.adminModel.findOne({ where: { id: decoded.adminId } });
    if (!admin || admin.status === 0) throw new Error('账号不可用');
    const accessToken = jwt.sign(
      { adminId: admin.id, roleId: admin.roleId, type: 'admin' },
      this.jwtSecret,
      { expiresIn: '7d' },
    );
    return { accessToken };
  }
}
