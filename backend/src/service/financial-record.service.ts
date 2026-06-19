import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialRecord } from '../entity/financial-record.entity';

/**
 * 财务记录服务
 * 处理财务记录的查询、创建及结算操作
 */
@Provide()
export class FinancialRecordService {
  @InjectEntityModel(FinancialRecord)
  recordRepo: Repository<FinancialRecord>;

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
}
