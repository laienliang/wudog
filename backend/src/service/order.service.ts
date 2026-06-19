import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';

/**
 * 订单服务
 * 处理系统订单的增删改查及多条件筛选操作
 */
@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  /**
   * 分页查询订单列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param orderType 订单类型筛选
   * @param status 订单状态筛选
   * @param keyword 搜索关键词（匹配订单号或备注）
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, orderType?: string, status?: string, keyword?: string) {
    const qb = this.orderRepo.createQueryBuilder('order')
      .where('order.is_deleted = 0');
    if (orderType) {
      qb.andWhere('order.order_type = :orderType', { orderType });
    }
    if (status) {
      qb.andWhere('order.status = :status', { status });
    }
    if (keyword) {
      qb.andWhere('(order.order_no LIKE :kw OR order.remark LIKE :kw)', { kw: `%${keyword}%` });
    }
    const [list, total] = await qb
      .orderBy('order.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找订单
   * @param id 订单 ID
   * @returns 订单实体或 null
   */
  async findById(id: number) {
    return await this.orderRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建订单
   * @param data 订单数据（部分字段）
   * @returns 创建成功的订单实体
   */
  async create(data: Partial<Order>) {
    const entity = this.orderRepo.create(data);
    return await this.orderRepo.save(entity);
  }

  /**
   * 更新订单信息
   * @param id 订单 ID
   * @param data 需要更新的字段
   * @returns 更新后的订单实体
   */
  async update(id: number, data: Partial<Order>) {
    await this.orderRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 软删除订单
   * @param id 订单 ID
   * @returns 更新结果
   */
  async delete(id: number) {
    return await this.orderRepo.update(id, { is_deleted: 1 });
  }
}
