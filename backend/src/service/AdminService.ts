import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@midwayjs/jwt';
import { AdminUser } from '../entity/AdminUser';

@Provide()
export class AdminService {
  @InjectEntityModel(AdminUser)
  adminRepo: Repository<AdminUser>;

  @Inject()
  jwtService: JwtService;

  async login(username: string, password: string) {
    const user = await this.adminRepo.findOne({
      where: { username, is_deleted: 0 },
    });

    if (!user || user.password !== password) {
      return null;
    }

    const token = await this.jwtService.sign({
      id: user.id,
      username: user.username,
      type: 'admin',
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
