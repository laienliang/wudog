import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Carousel } from '../entity/carousel.entity';

/**
 * 轮播图服务
 * 处理首页轮播图的增删改查操作
 */
@Provide()
export class CarouselService {
  @InjectEntityModel(Carousel)
  carouselRepo: Repository<Carousel>;

  /**
   * 分页查询轮播图列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配轮播图标题）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.carouselRepo.createQueryBuilder('carousel')
      .where('carousel.is_deleted = 0');
    if (keyword) {
      qb.andWhere('carousel.title LIKE :kw', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('carousel.sort_order', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找轮播图
   * @param id 轮播图 ID
   * @returns 轮播图实体或 null
   */
  async findById(id: number) {
    return await this.carouselRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建轮播图
   * @param data 轮播图数据（部分字段）
   * @returns 创建成功的轮播图实体
   */
  async create(data: Partial<Carousel>) {
    const entity = this.carouselRepo.create(data);
    return await this.carouselRepo.save(entity);
  }

  /**
   * 更新轮播图信息
   * @param id 轮播图 ID
   * @param data 需要更新的字段
   * @returns 更新后的轮播图实体
   */
  async update(id: number, data: Partial<Carousel>) {
    await this.carouselRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除轮播图
   * @param id 轮播图 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.carouselRepo.update(id, { is_deleted: 1 });
  }
}
