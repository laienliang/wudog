import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../entity/merchant.entity';

/**
 * 商家服务
 * 处理商家账号的增删改查操作
 */
@Provide()
export class MerchantService {
  @InjectEntityModel(Merchant)
  merchantRepo: Repository<Merchant>;

  /**
   * 根据用户名查找商家
   * @param username 用户名
   * @returns 商家实体或 null
   */
  async findByUsername(username: string) {
    return await this.merchantRepo.findOne({ where: { username, is_deleted: 0 } });
  }

  /**
   * 分页查询商家列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配用户名或商家名称）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.merchantRepo.createQueryBuilder('merchant')
      .where('merchant.is_deleted = 0');
    if (keyword) {
      qb.andWhere('(merchant.username LIKE :kw OR merchant.shop_name LIKE :kw)', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('merchant.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找商家
   * @param id 商家 ID
   * @returns 商家实体或 null
   */
  async findById(id: number) {
    return await this.merchantRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建商家
   * @param data 商家数据（部分字段）
   * @returns 创建成功的商家实体
   */
  async create(data: Partial<Merchant>) {
    const entity = this.merchantRepo.create(data);
    return await this.merchantRepo.save(entity);
  }

  /**
   * 更新商家信息
   * @param id 商家 ID
   * @param data 需要更新的字段
   * @returns 更新后的商家实体
   */
  async update(id: number, data: Partial<Merchant>) {
    await this.merchantRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除商家
   * @param id 商家 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.merchantRepo.update(id, { is_deleted: 1 });
  }
}
