import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from '../entity/recommendation.entity';

/**
 * 推荐位服务
 * 处理首页推荐位内容的增删改查操作
 */
@Provide()
export class RecommendationService {
  @InjectEntityModel(Recommendation)
  recommendationRepo: Repository<Recommendation>;

  /**
   * 分页查询推荐位列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param contentType 内容类型筛选
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, contentType?: string) {
    const qb = this.recommendationRepo.createQueryBuilder('recommendation')
      .where('recommendation.is_deleted = 0');
    if (contentType) {
      qb.andWhere('recommendation.content_type = :contentType', { contentType });
    }
    const [list, total] = await qb
      .orderBy('recommendation.sort_order', 'ASC')
      .addOrderBy('recommendation.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找推荐位
   * @param id 推荐位 ID
   * @returns 推荐位实体或 null
   */
  async findById(id: number) {
    return await this.recommendationRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建推荐位
   * @param data 推荐位数据（部分字段）
   * @returns 创建成功的推荐位实体
   */
  async create(data: Partial<Recommendation>) {
    const entity = this.recommendationRepo.create(data);
    return await this.recommendationRepo.save(entity);
  }

  /**
   * 更新推荐位信息
   * @param id 推荐位 ID
   * @param data 需要更新的字段
   * @returns 更新后的推荐位实体
   */
  async update(id: number, data: Partial<Recommendation>) {
    await this.recommendationRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除推荐位
   * @param id 推荐位 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.recommendationRepo.update(id, { is_deleted: 1 });
  }
}
