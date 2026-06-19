import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MessageTemplate } from '../entity/message-template.entity';

/**
 * 消息模板服务
 * 处理消息模板的增删改查操作
 */
@Provide()
export class MessageTemplateService {
  @InjectEntityModel(MessageTemplate)
  templateRepo: Repository<MessageTemplate>;

  /**
   * 分页查询消息模板列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param keyword 搜索关键词（匹配模板名称或模板编码）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.templateRepo.createQueryBuilder('template')
      .where('template.is_deleted = 0');
    if (keyword) {
      qb.andWhere('(template.name LIKE :kw OR template.code LIKE :kw)', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('template.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找消息模板
   * @param id 模板 ID
   * @returns 模板实体或 null
   */
  async findById(id: number) {
    return await this.templateRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 根据模板编码查找消息模板
   * @param code 模板编码
   * @returns 模板实体或 null
   */
  async findByCode(code: string) {
    return await this.templateRepo.findOne({ where: { code, is_deleted: 0 } });
  }

  /**
   * 创建消息模板
   * @param data 模板数据（部分字段）
   * @returns 创建成功的模板实体
   */
  async create(data: Partial<MessageTemplate>) {
    const entity = this.templateRepo.create(data);
    return await this.templateRepo.save(entity);
  }

  /**
   * 更新消息模板信息
   * @param id 模板 ID
   * @param data 需要更新的字段
   * @returns 更新后的模板实体
   */
  async update(id: number, data: Partial<MessageTemplate>) {
    await this.templateRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除消息模板
   * @param id 模板 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.templateRepo.update(id, { is_deleted: 1 });
  }
}
