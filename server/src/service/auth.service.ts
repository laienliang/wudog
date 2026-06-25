import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserProfile } from '../entity/user-profile.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export class AuthService {
  constructor(
    private userRepo: Repository<User>,
    private profileRepo: Repository<UserProfile>,
  ) {}

  async register(data: { username: string; password: string; phone?: string }) {
    const exist = await this.userRepo.findOne({ where: { username: data.username, is_deleted: 0 } });
    if (exist) throw new Error('用户名已存在');

    const hashed = await bcrypt.hash(data.password, 12);
    const user = this.userRepo.create({
      username: data.username,
      password: hashed,
      phone: data.phone || null,
      role: 'tourist',
    });
    const saved = await this.userRepo.save(user);

    const profile = this.profileRepo.create({
      user_id: saved.id,
      nickname: data.username,
    });
    await this.profileRepo.save(profile);

    const token = jwt.sign(
      { id: saved.id, username: saved.username, role: saved.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any },
    );

    return { user: { id: saved.id, username: saved.username, role: saved.role }, token };
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username, is_deleted: 0 } });
    if (!user) throw new Error('用户名或密码错误');
    if (user.status === 0) throw new Error('账号已被禁用');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('用户名或密码错误');

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any },
    );

    return { user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar }, token };
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId, is_deleted: 0 } });
    if (!user) throw new Error('用户不存在');
    const profile = await this.profileRepo.findOne({ where: { user_id: userId } });
    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      profile: profile || null,
    };
  }

  async updateProfile(userId: number, data: any) {
    const profile = await this.profileRepo.findOne({ where: { user_id: userId } });
    if (!profile) throw new Error('用户资料不存在');
    if (data.nickname !== undefined) profile.nickname = data.nickname;
    if (data.gender !== undefined) profile.gender = data.gender;
    if (data.region !== undefined) profile.region = data.region;
    if (data.bio !== undefined) profile.bio = data.bio;
    await this.profileRepo.save(profile);

    if (data.avatar !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) {
        user.avatar = data.avatar;
        await this.userRepo.save(user);
      }
    }
    return this.getUserInfo(userId);
  }
}
