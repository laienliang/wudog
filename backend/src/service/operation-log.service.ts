import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OperationLog } from '../entity/operation-log.entity';

/**
 * 操作日志服务
 * 处理系统操作日志的记录和查询操作
 */
@Provide()
export class OperationLogService {
  @InjectEntityModel(OperationLog)
  logRepo: Repository<OperationLog>;

  /**
   * 分页查询操作日志列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param operator_id 操作人 ID 筛选
   * @param action 操作类型筛选（模糊匹配）
   * @param keyword 搜索关键词（匹配操作人名称或操作内容）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, operator_id?: number, action?: string, keyword?: string) {
    const qb = this.logRepo.createQueryBuilder('log')
      .where('log.is_deleted = 0');
    if (operator_id) {
      qb.andWhere('log.operator_id = :operator_id', { operator_id });
    }
    if (action) {
      qb.andWhere('log.action LIKE :action', { action: `%${action}%` });
    }
    if (keyword) {
      qb.andWhere('(log.operator_name LIKE :kw OR log.content LIKE :kw)', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('log.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找操作日志
   * @param id 日志 ID
   * @returns 操作日志实体或 null
   */
  async findById(id: number) {
    return await this.logRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建操作日志
   * @param data 日志数据（部分字段）
   * @returns 创建成功的操作日志实体
   */
  async create(data: Partial<OperationLog>) {
    const entity = this.logRepo.create(data);
    return await this.logRepo.save(entity);
  }

  /**
   * 更新操作日志信息
   * @param id 日志 ID
   * @param data 需要更新的字段
   * @returns 更新后的操作日志实体
   */
  async update(id: number, data: Partial<OperationLog>) {
    await this.logRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除操作日志
   * @param id 日志 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.logRepo.update(id, { is_deleted: 1 });
  }
}
