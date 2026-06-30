import { Provide, Inject, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { RedisService } from '@midwayjs/redis';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '../../../common/entity/user.entity';
import { SmsService } from './sms.service';
import { TokenPair, UserProfile } from '../interface/auth.interface';
import { UpdateProfileDTO } from '../dto/update-profile.dto';

const SALT_ROUNDS = 12;

@Provide()
export class AuthService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  @Inject()
  smsService: SmsService;

  @Inject()
  redisService: RedisService;

  @Config('jwt.secret')
  jwtSecret: string;

  @Config('jwt.accessTokenExpiresIn')
  accessTokenExpiresIn: string;

  @Config('jwt.refreshTokenExpiresIn')
  refreshTokenExpiresIn: string;

  /**
   * 手机号注册
   */
  async register(phone: string, code: string, password: string): Promise<TokenPair> {
    // 校验验证码
    const valid = await this.smsService.verifyCode(phone, code);
    if (!valid) throw new Error('验证码错误或已过期');

    // 检查手机号是否已注册
    const existing = await this.userModel.findOne({ where: { phone } });
    if (existing) throw new Error('该手机号已注册');

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userModel.save({
      phone,
      password: hashedPassword,
      nickname: `用户${phone.slice(-4)}`,
      lastLoginAt: new Date(),
    });

    return this.generateTokens(user.id);
  }

  /**
   * 密码登录（含错误次数锁定）
   */
  async login(phone: string, password: string): Promise<TokenPair> {
    // 检查是否被锁定
    const lockKey = `login:lock:${phone}`;
    const locked = await this.redisService.get(lockKey);
    if (locked) throw new Error('账号已临时锁定，请15分钟后再试');

    const user = await this.userModel.findOne({ where: { phone } });
    if (!user || !user.password) {
      await this.recordLoginFail(phone);
      throw new Error('手机号或密码错误');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await this.recordLoginFail(phone);
      throw new Error('手机号或密码错误');
    }

    // 登录成功，清除失败记录
    await this.redisService.del(`login:fail:${phone}`);
    await this.userModel.update(user.id, { lastLoginAt: new Date() });
    return this.generateTokens(user.id);
  }

  /**
   * 记录登录失败次数（5次后锁定15分钟）
   */
  private async recordLoginFail(phone: string): Promise<void> {
    const failKey = `login:fail:${phone}`;
    const count = await this.redisService.incr(failKey);
    await this.redisService.expire(failKey, 15 * 60);
    if (count >= 5) {
      await this.redisService.set(`login:lock:${phone}`, '1', 'EX', 15 * 60);
    }
  }

  /**
   * 验证码登录
   */
  async smsLogin(phone: string, code: string): Promise<TokenPair> {
    const valid = await this.smsService.verifyCode(phone, code);
    if (!valid) throw new Error('验证码错误或已过期');

    // 查找或创建用户
    let user = await this.userModel.findOne({ where: { phone } });
    if (!user) {
      user = await this.userModel.save({
        phone,
        nickname: `用户${phone.slice(-4)}`,
      });
    }

    await this.userModel.update(user.id, { lastLoginAt: new Date() });
    return this.generateTokens(user.id);
  }

  /**
   * 微信登录
   * TODO: 对接微信开放平台，使用 code 换取 openid
   */
  async wxLogin(code: string, phone?: string): Promise<TokenPair> {
    // TODO: 调用微信接口用 code 换取 openid 和 session_key
    // const wxResult = await this.getWxOpenid(code);
    if (!code) {
      throw new Error('无效的微信授权码');
    }

    // 开发阶段：如果提供了 phone，查找已有用户或创建新用户
    if (phone) {
      let user = await this.userModel.findOne({ where: { phone } });
      if (!user) {
        user = await this.userModel.save({
          phone,
          nickname: `用户${phone.slice(-4)}`,
        });
      }
      await this.userModel.update(user.id, { lastLoginAt: new Date() });
      return this.generateTokens(user.id);
    }

    // 没有手机号则无法完成登录（MVP阶段暂不实现静默授权）
    throw new Error('微信登录需要绑定手机号');
  }

  /**
   * 生成 Token 对
   */
  private async generateTokens(userId: number): Promise<TokenPair> {
    const tokenId = randomUUID();
    const accessToken = jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.accessTokenExpiresIn as any,
    });

    const refreshToken = jwt.sign({ userId, type: 'refresh', tokenId }, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiresIn as any,
    });

    // Refresh Token 存入 Redis（支持多设备）
    const refreshTtl = 30 * 24 * 60 * 60;
    await this.redisService.set(`refresh:${userId}:${tokenId}`, refreshToken, 'EX', refreshTtl);

    return { accessToken, refreshToken };
  }

  /**
   * 刷新 Token
   */
  async refreshToken(token: string): Promise<TokenPair> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      if (decoded.type !== 'refresh') throw new Error('无效的 Refresh Token');

      const { userId, tokenId } = decoded;
      const stored = await this.redisService.get(`refresh:${userId}:${tokenId}`);
      if (stored !== token) throw new Error('Refresh Token 已失效');

      // 删除旧 token，生成新 token
      await this.redisService.del(`refresh:${userId}:${tokenId}`);
      return this.generateTokens(userId);
    } catch (err) {
      throw new Error('Token 无效或已过期');
    }
  }

  /**
   * 退出登录
   */
  async logout(userId: number, accessToken: string): Promise<void> {
    // 删除该用户的所有 Refresh Token（多设备全部下线）
    const keys = await this.redisService.keys(`refresh:${userId}:*`);
    if (keys.length) await this.redisService.del(...keys);

    // Access Token 加入黑名单（剩余有效期）
    try {
      const decoded = jwt.decode(accessToken) as any;
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await this.redisService.set(`blacklist:${accessToken}`, '1', 'EX', ttl);
        }
      }
    } catch (_) {
      /* ignore invalid token */
    }
  }

  /**
   * 获取用户信息
   */
  async getProfile(userId: number): Promise<UserProfile> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) throw new Error('用户不存在');

    return {
      id: user.id,
      phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      nickname: user.nickname,
      avatar: user.avatar,
      gender: user.gender,
      region: user.region,
      bio: user.bio,
      createdAt: user.createdAt,
    };
  }

  /**
   * 更新用户资料
   */
  async updateProfile(userId: number, dto: UpdateProfileDTO): Promise<UserProfile> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) throw new Error('用户不存在');

    const updateData: Partial<User> = {};
    if (dto.nickname !== undefined) updateData.nickname = dto.nickname || undefined;
    if (dto.avatar !== undefined) updateData.avatar = dto.avatar || undefined;
    if (dto.gender !== undefined) updateData.gender = dto.gender;
    if (dto.region !== undefined) updateData.region = dto.region || undefined;
    if (dto.bio !== undefined) updateData.bio = dto.bio || undefined;

    if (Object.keys(updateData).length > 0) {
      await this.userModel.update(userId, updateData);
    }

    return this.getProfile(userId);
  }
}
