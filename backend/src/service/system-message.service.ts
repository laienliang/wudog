import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMessage } from '../entity/system-message.entity';

/**
 * 系统消息服务
 * 处理系统消息的发送、查询、已读标记及批量发送操作
 */
@Provide()
export class SystemMessageService {
  @InjectEntityModel(SystemMessage)
  messageRepo: Repository<SystemMessage>;

  /**
   * 分页查询系统消息列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param userId 接收用户 ID 筛选
   * @param messageType 消息类型筛选
   * @param isRead 已读状态筛选（0-未读，1-已读）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, userId?: number, messageType?: string, isRead?: number) {
    const qb = this.messageRepo.createQueryBuilder('message')
      .where('message.is_deleted = 0');
    if (userId !== undefined && userId !== null) {
      qb.andWhere('message.user_id = :userId', { userId });
    }
    if (messageType) {
      qb.andWhere('message.message_type = :messageType', { messageType });
    }
    if (isRead !== undefined && isRead !== null) {
      qb.andWhere('message.is_read = :isRead', { isRead });
    }
    const [list, total] = await qb
      .orderBy('message.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找系统消息
   * @param id 消息 ID
   * @returns 消息实体或 null
   */
  async findById(id: number) {
    return await this.messageRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建系统消息
   * @param data 消息数据（部分字段）
   * @returns 创建成功的消息实体
   */
  async create(data: Partial<SystemMessage>) {
    const entity = this.messageRepo.create(data);
    return await this.messageRepo.save(entity);
  }

  /**
   * 标记消息为已读
   * @param id 消息 ID
   * @returns 更新后的消息实体
   */
  async markAsRead(id: number) {
    await this.messageRepo.update(id, { is_read: 1 });
    return await this.findById(id);
  }

  /**
   * 批量发送系统消息
   * @param userIds 接收用户 ID 列表
   * @param data 消息数据（部分字段，不含 user_id）
   * @returns 包含发送条数的结果对象
   */
  async batchSend(userIds: number[], data: Partial<SystemMessage>) {
    const entities: Partial<SystemMessage>[] = userIds.map(uid => ({
      ...data,
      user_id: uid,
    }));
    const result = await this.messageRepo.save(entities as any);
    return { affected: Array.isArray(result) ? result.length : 1 };
  }

  /**
   * 更新系统消息信息
   * @param id 消息 ID
   * @param data 需要更新的字段
   * @returns 更新后的消息实体
   */
  async update(id: number, data: Partial<SystemMessage>) {
    await this.messageRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除系统消息
   * @param id 消息 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.messageRepo.update(id, { is_deleted: 1 });
  }
}
