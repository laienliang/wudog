import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entity/admin.entity';

/**
 * 管理员服务
 * 处理管理员账号的增删改查操作
 */
@Provide()
export class AdminService {
  @InjectEntityModel(Admin)
  adminRepo: Repository<Admin>;

  /**
   * 根据用户名查找管理员
   * @param username 用户名
   * @returns 管理员实体或 null
   */
  async findByUsername(username: string) {
    return await this.adminRepo.findOne({ where: { username, is_deleted: 0 } });
  }

  /**
   * 分页查询管理员列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配用户名或姓名）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.adminRepo.createQueryBuilder('admin')
      .where('admin.is_deleted = 0');
    if (keyword) {
      qb.andWhere('(admin.username LIKE :kw OR admin.name LIKE :kw)', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('admin.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找管理员
   * @param id 管理员 ID
   * @returns 管理员实体或 null
   */
  async findById(id: number) {
    return await this.adminRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建管理员
   * @param data 管理员数据（部分字段）
   * @returns 创建成功的管理员实体
   */
  async create(data: Partial<Admin>) {
    const entity = this.adminRepo.create(data);
    return await this.adminRepo.save(entity);
  }

  /**
   * 更新管理员信息
   * @param id 管理员 ID
   * @param data 需要更新的字段
   * @returns 更新后的管理员实体
   */
  async update(id: number, data: Partial<Admin>) {
    await this.adminRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除管理员
   * @param id 管理员 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.adminRepo.update(id, { is_deleted: 1 });
  }
}
