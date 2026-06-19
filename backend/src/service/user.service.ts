import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

/**
 * 用户服务
 * 处理前端用户的增删改查及多种查询方式
 */
@Provide()
export class UserService {
  @InjectEntityModel(User)
  userRepo: Repository<User>;

  /**
   * 分页查询用户列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配用户名、昵称或手机号）
   * @param status 用户状态筛选
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string, status?: number) {
    const qb = this.userRepo.createQueryBuilder('user')
      .where('user.is_deleted = 0');
    if (keyword) {
      qb.andWhere('(user.username LIKE :kw OR user.nickname LIKE :kw OR user.phone LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('user.status = :status', { status });
    }
    const [list, total] = await qb
      .orderBy('user.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找用户
   * @param id 用户 ID
   * @returns 用户实体或 null
   */
  async findById(id: number) {
    return await this.userRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户实体或 null
   */
  async findByUsername(username: string) {
    return await this.userRepo.findOne({ where: { username, is_deleted: 0 } });
  }

  /**
   * 根据手机号查找用户
   * @param phone 手机号
   * @returns 用户实体或 null
   */
  async findByPhone(phone: string) {
    return await this.userRepo.findOne({ where: { phone, is_deleted: 0 } });
  }

  /**
   * 根据微信 openid 查找用户
   * @param openid 微信 openid
   * @returns 用户实体或 null
   */
  async findByOpenid(openid: string) {
    return await this.userRepo.findOne({ where: { openid, is_deleted: 0 } });
  }

  /**
   * 创建用户
   * @param data 用户数据（部分字段）
   * @returns 创建成功的用户实体
   */
  async create(data: Partial<User>) {
    const entity = this.userRepo.create(data);
    return await this.userRepo.save(entity);
  }

  /**
   * 更新用户信息
   * @param id 用户 ID
   * @param data 需要更新的字段
   * @returns 更新后的用户实体
   */
  async update(id: number, data: Partial<User>) {
    await this.userRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除用户
   * @param id 用户 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.userRepo.update(id, { is_deleted: 1 });
  }
}
