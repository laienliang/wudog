import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entity/announcement.entity';

/**
 * 公告服务
 * 处理系统公告的增删改查操作
 */
@Provide()
export class AnnouncementService {
  @InjectEntityModel(Announcement)
  announcementRepo: Repository<Announcement>;

  /**
   * 分页查询公告列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配公告标题）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.announcementRepo.createQueryBuilder('announcement')
      .where('announcement.is_deleted = 0');
    if (keyword) {
      qb.andWhere('announcement.title LIKE :kw', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('announcement.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找公告
   * @param id 公告 ID
   * @returns 公告实体或 null
   */
  async findById(id: number) {
    return await this.announcementRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建公告
   * @param data 公告数据（部分字段）
   * @returns 创建成功的公告实体
   */
  async create(data: Partial<Announcement>) {
    const entity = this.announcementRepo.create(data);
    return await this.announcementRepo.save(entity);
  }

  /**
   * 更新公告信息
   * @param id 公告 ID
   * @param data 需要更新的字段
   * @returns 更新后的公告实体
   */
  async update(id: number, data: Partial<Announcement>) {
    await this.announcementRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除公告
   * @param id 公告 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.announcementRepo.update(id, { is_deleted: 1 });
  }
}
