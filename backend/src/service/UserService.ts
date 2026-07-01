import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@midwayjs/jwt';
import { User } from '../entity/User';
import * as bcrypt from 'bcryptjs';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userRepo: Repository<User>;

  @Inject()
  jwtService: JwtService;

  async register(username: string, password: string, nickname?: string, phone?: string) {
    const existing = await this.userRepo.findOne({
      where: { username, is_deleted: 0 },
    });
    if (existing) {
      return null;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = this.userRepo.create({
      username,
      password: hashedPassword,
      nickname: nickname || username,
      phone,
    });
    const saved = await this.userRepo.save(user);

    const token = await this.jwtService.sign({
      id: saved.id,
      username: saved.username,
      type: 'user',
    });

    return {
      token,
      user: { id: saved.id, username: saved.username, nickname: saved.nickname, phone: saved.phone, avatar: saved.avatar },
    };
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username, is_deleted: 0 },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }

    const token = await this.jwtService.sign({
      id: user.id,
      username: user.username,
      type: 'user',
    });

    return {
      token,
      user: { id: user.id, username: user.username, nickname: user.nickname, phone: user.phone, avatar: user.avatar },
    };
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId, is_deleted: 0 },
    });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: number, data: { nickname?: string; avatar?: string; phone?: string }) {
    await this.userRepo.update(userId, data);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return { error: '原密码错误' };
    }
    const hashed = bcrypt.hashSync(newPassword, 10);
    await this.userRepo.update(userId, { password: hashed });
    return { success: true };
  }
}
