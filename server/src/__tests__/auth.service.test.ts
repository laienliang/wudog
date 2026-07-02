import { AuthService } from '../service/auth.service';
import { User } from '../entity/user.entity';
import { UserProfile } from '../entity/user-profile.entity';

// 必须在 mock 之前导入 config 使其生效
jest.mock('../config/config', () => ({
  __esModule: true,
  default: {
    port: 3000,
    jwt: { secret: 'test-secret', expiresIn: '7d' },
    database: { type: 'mysql', host: '127.0.0.1', port: 3306, username: 'root', password: '123456', database: 'test', synchronize: false, logging: false },
    upload: { dir: 'uploads', maxSize: 10485760, allowedTypes: ['image/jpeg'] },
  },
}));

const bcrypt = require('bcryptjs');
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$12$hashedpassword'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => {
  const sign = jest.fn(() => 'mock-jwt-token');
  return { __esModule: true, default: { sign }, sign };
});

function mockRepo(overrides: any = {}) {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn().mockImplementation((d) => d),
    save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
    ...overrides,
  } as any;
}

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;
  let profileRepo: any;

  beforeEach(() => {
    userRepo = mockRepo();
    profileRepo = mockRepo();
    service = new AuthService(userRepo, profileRepo);
  });

  describe('register', () => {
    it('应该成功注册新用户并返回 token', async () => {
      userRepo.findOne.mockResolvedValue(null); // 用户名不存在

      const result = await service.register({ username: 'testuser', password: '123456' });

      expect(result.user.username).toBe('testuser');
      expect(result.user.role).toBe('tourist');
      expect(userRepo.create).toHaveBeenCalledTimes(1);
      expect(profileRepo.create).toHaveBeenCalledTimes(1);
    });

    it('用户名已存在时应该抛错', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, username: 'testuser' });

      await expect(
        service.register({ username: 'testuser', password: '123456' }),
      ).rejects.toThrow('用户名已存在');
    });

    it('应该支持可选手机号', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.register({
        username: 'user2', password: '123456', phone: '13800138000',
      });

      expect(result.user.username).toBe('user2');
    });
  });

  describe('login', () => {
    it('应该成功登录并返回 token', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      userRepo.findOne.mockResolvedValue({
        id: 1, username: 'admin', password: 'hash', role: 'admin',
        avatar: null, status: 1,
      });

      const result = await service.login('admin', 'admin123');

      expect(result.user.username).toBe('admin');
    });

    it('用户不存在时应该抛错', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.login('nobody', '123')).rejects.toThrow('用户名或密码错误');
    });

    it('密码错误时应该抛错', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, username: 'admin', password: 'hash', status: 1 });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('admin', 'wrong')).rejects.toThrow('用户名或密码错误');
    });

    it('账号被禁用时应该抛错', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1, username: 'admin', password: 'hash', status: 0 });

      await expect(service.login('admin', 'admin123')).rejects.toThrow('账号已被禁用');
    });
  });

  describe('getUserInfo', () => {
    it('应该返回用户信息和资料', async () => {
      userRepo.findOne.mockResolvedValue({
        id: 1, username: 'admin', phone: '138****', avatar: '/a.jpg', role: 'admin', status: 1,
      });
      profileRepo.findOne.mockResolvedValue({ nickname: '管理员', gender: 'male', region: '北京' });

      const info = await service.getUserInfo(1);

      expect(info.username).toBe('admin');
      expect(info.profile.nickname).toBe('管理员');
    });

    it('用户不存在时应该抛错', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.getUserInfo(999)).rejects.toThrow('用户不存在');
    });
  });

  describe('updateProfile', () => {
    it('应该更新用户资料', async () => {
      const profile = { nickname: 'old', gender: null, region: null, bio: null };
      profileRepo.findOne.mockResolvedValue(profile);
      userRepo.findOne.mockResolvedValue({ id: 1, avatar: null, username: 'u', role: 'tourist', status: 1, phone: null });

      await service.updateProfile(1, { nickname: 'new', gender: 'male' });

      expect(profileRepo.save).toHaveBeenCalled();
      expect(profile.nickname).toBe('new');
      expect(profile.gender).toBe('male');
    });

    it('资料不存在时应该抛错', async () => {
      profileRepo.findOne.mockResolvedValue(null);

      await expect(service.updateProfile(999, { nickname: 'x' })).rejects.toThrow('用户资料不存在');
    });
  });
});
