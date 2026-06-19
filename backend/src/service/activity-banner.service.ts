import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityBanner } from '../entity/activity-banner.entity';

/**
 * 活动横幅服务
 * 处理活动横幅的增删改查操作
 */
@Provide()
export class ActivityBannerService {
  @InjectEntityModel(ActivityBanner)
  bannerRepo: Repository<ActivityBanner>;

  /**
   * 分页查询活动横幅列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配横幅标题）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.bannerRepo.createQueryBuilder('banner')
      .where('banner.is_deleted = 0');
    if (keyword) {
      qb.andWhere('banner.title LIKE :kw', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('banner.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找活动横幅
   * @param id 横幅 ID
   * @returns 横幅实体或 null
   */
  async findById(id: number) {
    return await this.bannerRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建活动横幅
   * @param data 横幅数据（部分字段）
   * @returns 创建成功的横幅实体
   */
  async create(data: Partial<ActivityBanner>) {
    const entity = this.bannerRepo.create(data);
    return await this.bannerRepo.save(entity);
  }

  /**
   * 更新活动横幅信息
   * @param id 横幅 ID
   * @param data 需要更新的字段
   * @returns 更新后的横幅实体
   */
  async update(id: number, data: Partial<ActivityBanner>) {
    await this.bannerRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除活动横幅
   * @param id 横幅 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.bannerRepo.update(id, { is_deleted: 1 });
  }
}
