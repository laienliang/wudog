import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialRecord } from '../entity/financial-record.entity';
import { Order } from '../entity/order.entity';
import { SystemConfigService } from './system-config.service';

/**
 * 财务记录服务
 * 处理财务记录的查询、创建及结算操作
 */
@Provide()
export class FinancialRecordService {
  @InjectEntityModel(FinancialRecord)
  recordRepo: Repository<FinancialRecord>;

  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  @Inject()
  systemConfigService: SystemConfigService;

  /**
   * 分页查询财务记录列表
   * @param page 页码，默认第 1 页
   * @param pageSize 每页条数，默认 20
   * @param merchantId 商家 ID 筛选
   * @param settlementStatus 结算状态筛选
   * @returns 包含列表、总数、页码和每页条数的分页结果
   */
  async findAll(page = 1, pageSize = 20, merchantId?: number, settlementStatus?: string) {
    const qb = this.recordRepo.createQueryBuilder('record')
      .where('record.is_deleted = 0');
    if (merchantId !== undefined && merchantId !== null) {
      qb.andWhere('record.merchant_id = :merchantId', { merchantId });
    }
    if (settlementStatus) {
      qb.andWhere('record.settlement_status = :settlementStatus', { settlementStatus });
    }
    const [list, total] = await qb
      .orderBy('record.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 根据 ID 查找财务记录
   * @param id 记录 ID
   * @returns 财务记录实体或 null
   */
  async findById(id: number) {
    return await this.recordRepo.findOne({ where: { id, is_deleted: 0 } });
  }

  /**
   * 创建财务记录
   * @param data 财务记录数据（部分字段）
   * @returns 创建成功的财务记录实体
   */
  async create(data: Partial<FinancialRecord>) {
    const entity = this.recordRepo.create(data);
    return await this.recordRepo.save(entity);
  }

  /**
   * 更新财务记录信息
   * @param id 记录 ID
   * @param data 需要更新的字段
   * @returns 更新后的财务记录实体
   */
  async update(id: number, data: Partial<FinancialRecord>) {
    await this.recordRepo.update(id, data);
    return await this.findById(id);
  }

  /**
   * 单条结算操作
   * @param id 记录 ID
   * @returns 更新后的财务记录实体
   */
  async settle(id: number) {
    await this.recordRepo.update(id, {
      settlement_status: 'settled',
      settled_at: new Date(),
    } as any);
    return await this.findById(id);
  }

  /**
   * 批量结算操作
   * @param ids 需要结算的记录 ID 列表
   * @returns 包含影响行数的结果对象
   */
  async settleBatch(ids: number[]) {
    if (ids.length === 0) {
      return { affected: 0 };
    }
    const result = await this.recordRepo.createQueryBuilder()
      .update(FinancialRecord)
      .set({ settlement_status: 'settled', settled_at: () => 'NOW()' })
      .whereInIds(ids)
      .andWhere('is_deleted = 0')
      .execute();
    return { affected: result.affected || 0 };
  }

  /**
   * 自动生成结算单
   * @param orderIds 可选，指定订单ID列表时仅为这些订单生成；不指定时扫描所有符合条件的订单
   */
  async generateSettlementBills(orderIds?: number[]) {
    // 读取各模块抽佣比例
    const commissionRates: Record<string, number> = {};
    for (const key of ['commission_rate_clothing', 'commission_rate_food', 'commission_rate_stay', 'commission_rate_travel']) {
      const cfg = await this.systemConfigService.findByKey(key);
      commissionRates[key] = cfg ? Number(cfg.config_value) : 0.1;
    }

    // 订单类型 -> 抽佣配置键
    const rateKeyMap: Record<string, string> = {
      product: 'commission_rate_clothing',
      food_order: 'commission_rate_food',
      stay: 'commission_rate_stay',
      ticket: 'commission_rate_travel',
      route: 'commission_rate_travel',
    };

    let generated = 0;
    let skipped = 0;

    // 构建查询：指定订单ID时仅查这些订单，否则查所有已完成的
    const qb = this.orderRepo.createQueryBuilder('o')
      .where('o.is_deleted = 0');
    if (orderIds && orderIds.length > 0) {
      qb.andWhere('o.id IN (:...ids)', { ids: orderIds });
    } else {
      qb.andWhere('o.status IN (:...statuses)', { statuses: ['completed', 'paid', 'shipped'] });
    }
    const orders = await qb.getMany();

    for (const order of orders) {
      // 检查是否已有财务记录
      const existing = await this.recordRepo.createQueryBuilder('r')
        .where('r.order_id = :orderId', { orderId: order.id })
        .andWhere('r.is_deleted = 0')
        .getOne();
      if (existing) { skipped++; continue; }

      const rateKey = rateKeyMap[order.order_type] || 'commission_rate_clothing';
      const amount = Number(order.total_amount || 0);
      const rate = commissionRates[rateKey] || 0.1;
      const commissionAmount = Math.round(amount * rate * 100) / 100;
      const merchantIncome = Math.round((amount - commissionAmount) * 100) / 100;

      await this.recordRepo.save(this.recordRepo.create({
        order_id: order.id,
        order_no: order.order_no,
        merchant_id: order.merchant_id,
        order_amount: amount,
        commission_rate: rate,
        commission_amount: commissionAmount,
        merchant_income: merchantIncome,
        settlement_status: 'pending',
      }));
      generated++;
    }

    return { generated, skipped };
  }
}
