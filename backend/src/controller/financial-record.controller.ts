import { Controller, Post, Get, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialRecordService } from '../service/financial-record.service';
import { Order } from '../entity/order.entity';
import { FinancialRecord } from '../entity/financial-record.entity';

/**
 * 财务记录控制器
 * 处理财务记录相关的 API 请求，包括财务记录的查询和结算操作
 */
@Controller('/api/financial-records')
export class FinancialRecordController {
  @Inject()
  financialRecordService: FinancialRecordService;

  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  @InjectEntityModel(FinancialRecord)
  recordRepo: Repository<FinancialRecord>;

  /**
   * 获取财务记录列表（分页）
   * GET /api/financial-records/list
   * @param page - 页码，默认 1
   * @param pageSize - 每页数量，默认 20
   * @param merchantId - 商家 ID 筛选（可选）
   * @param settlementStatus - 结算状态筛选（可选）
   * @returns 分页财务记录列表
   */
  @Get('/list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('merchantId') merchantId?: number,
    @Query('settlementStatus') settlementStatus?: string
  ) {
    const result = await this.financialRecordService.findAll(
      Number(page), Number(pageSize), merchantId, settlementStatus
    );
    return { code: 200, message: 'success', data: result };
  }

  /**
   * 获取财务记录详情
   * GET /api/financial-records/detail/:id
   * @param id - 财务记录 ID
   * @returns 财务记录详细信息
   */
  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const item = await this.financialRecordService.findById(Number(id));
    if (!item) return { code: 404, message: '记录不存在', data: null };
    return { code: 200, message: 'success', data: item };
  }

  /**
   * 单笔结算
   * POST /api/financial-records/settle/:id
   * @param id - 财务记录 ID
   * @returns 结算后的财务记录信息
   */
  @Post('/settle/:id')
  async settle(@Param('id') id: number) {
    const item = await this.financialRecordService.settle(Number(id));
    if (!item) return { code: 404, message: '记录不存在', data: null };
    return { code: 200, message: '结算成功', data: item };
  }

  /**
   * 批量结算
   * POST /api/financial-records/settle-batch
   * @param body - 包含 ids（财务记录 ID 数组）
   * @returns 批量结算结果
   */
  @Post('/settle-batch')
  async settleBatch(@Body() body: { ids: number[] }) {
    const result = await this.financialRecordService.settleBatch(body.ids);
    return { code: 200, message: '批量结算成功', data: result };
  }

  /**
   * 自动生成结算单
   * POST /api/financial-records/generate
   * 根据 R11-05 规则，对已完成的订单按周期生成待结算财务记录
   */
  @Post('/generate')
  async generate() {
    try {
      const result = await this.financialRecordService.generateSettlementBills();
      return { code: 200, message: `成功生成 ${result.generated} 条结算单，跳过 ${result.skipped} 条已有记录`, data: result };
    } catch (error) {
      return { code: 500, message: error.message, data: null };
    }
  }

  /**
   * 获取财务汇总数据
   * GET /api/financial-records/summary
   * @returns 财务汇总（总营收、平台收入、商家收入、待结算金额）
   */
  @Get('/summary')
  async summary() {
    try {
      const allRecords = await this.financialRecordService.findAll(1, 10000);
      const records = allRecords.list || [];

      const totalRevenue = records.reduce((sum: number, r: any) => sum + Number(r.order_amount || 0), 0);
      const platformIncome = records.reduce((sum: number, r: any) => sum + Number(r.commission_amount || 0), 0);
      const merchantIncome = records.reduce((sum: number, r: any) => sum + Number(r.merchant_income || 0), 0);
      const pendingSettlement = records
        .filter((r: any) => r.settlement_status === 'pending')
        .reduce((sum: number, r: any) => sum + Number(r.merchant_income || 0), 0);

      return {
        code: 200,
        message: 'success',
        data: {
          total_revenue: totalRevenue,
          platform_income: platformIncome,
          merchant_income: merchantIncome,
          pending_settlement: pendingSettlement,
        },
      };
    } catch (error) {
      return { code: 500, message: error.message, data: null };
    }
  }

  /**
   * 获取商家收入汇总
   * GET /api/financial-records/merchant-summary
   * @returns 按商家分组的收入汇总列表
   */
  @Get('/merchant-summary')
  async merchantSummary() {
    try {
      const allRecords = await this.financialRecordService.findAll(1, 10000);
      const records = allRecords.list || [];

      // 按商家分组汇总
      const merchantMap = new Map();
      records.forEach((r: any) => {
        const id = r.merchant_id;
        if (!merchantMap.has(id)) {
          merchantMap.set(id, {
            merchant_id: id,
            merchant_name: `商家${id}`,
            order_count: 0,
            total_amount: 0,
            commission_amount: 0,
            merchant_income: 0,
            pending_amount: 0,
          });
        }
        const m = merchantMap.get(id);
        m.order_count++;
        m.total_amount += Number(r.order_amount || 0);
        m.commission_amount += Number(r.commission_amount || 0);
        m.merchant_income += Number(r.merchant_income || 0);
        if (r.settlement_status === 'pending') {
          m.pending_amount += Number(r.merchant_income || 0);
        }
      });

      return {
        code: 200,
        message: 'success',
        data: Array.from(merchantMap.values()),
      };
    } catch (error) {
      return { code: 500, message: error.message, data: null };
    }
  }

  /**
   * 对账接口
   * GET /api/financial-records/reconciliation
   * 对比订单表和财务记录表，找出差异数据
   */
  @Get('/reconciliation')
  async reconciliation() {
    try {
      // 平台总体对比：已完成订单总额 vs 财务记录总额
      const orderTotal = await this.orderRepo.createQueryBuilder('o')
        .select('COALESCE(SUM(o.total_amount),0)', 'total')
        .addSelect('COUNT(*)', 'count')
        .where('o.is_deleted = 0')
        .andWhere('o.status IN (:...s)', { s: ['completed', 'paid', 'shipped'] })
        .getRawOne();

      const recordTotal = await this.recordRepo.createQueryBuilder('r')
        .select('COALESCE(SUM(r.order_amount),0)', 'total')
        .addSelect('COUNT(*)', 'count')
        .where('r.is_deleted = 0')
        .getRawOne();

      // 按商家维度对比：找出有订单但无财务记录的商家
      const ordersByMerchant = await this.orderRepo.createQueryBuilder('o')
        .select('o.merchant_id', 'merchantId')
        .addSelect('COUNT(*)', 'orderCount')
        .addSelect('COALESCE(SUM(o.total_amount),0)', 'orderAmount')
        .where('o.is_deleted = 0')
        .andWhere('o.status IN (:...s)', { s: ['completed'] })
        .andWhere('o.merchant_id IS NOT NULL')
        .groupBy('o.merchant_id')
        .getRawMany();

      const recordsByMerchant = await this.recordRepo.createQueryBuilder('r')
        .select('r.merchant_id', 'merchantId')
        .addSelect('COUNT(*)', 'recordCount')
        .addSelect('COALESCE(SUM(r.order_amount),0)', 'recordAmount')
        .where('r.is_deleted = 0')
        .groupBy('r.merchant_id')
        .getRawMany();

      const recordMap = new Map(recordsByMerchant.map((r: any) => [r.merchantId, r]));

      const merchantDiff = ordersByMerchant.map((o: any) => {
        const r = recordMap.get(o.merchantId);
        const recordAmount = r ? Number(r.recordAmount) : 0;
        const recordCount = r ? Number(r.recordCount) : 0;
        const orderAmount = Number(o.orderAmount);
        const diff = Math.round((orderAmount - recordAmount) * 100) / 100;
        return {
          merchantId: o.merchantId,
          orderCount: Number(o.orderCount),
          orderAmount,
          recordCount,
          recordAmount,
          diff,
          status: diff === 0 ? 'matched' : (recordCount === 0 ? 'missing_records' : 'amount_mismatch'),
        };
      });

      // 找出有订单但完全没有财务记录的订单
      const missingOrderIds = await this.orderRepo.createQueryBuilder('o')
        .leftJoin('financial_record', 'r', 'r.order_id = o.id AND r.is_deleted = 0')
        .where('o.is_deleted = 0')
        .andWhere('o.status = :s', { s: 'completed' })
        .andWhere('r.id IS NULL')
        .select(['o.id', 'o.order_no', 'o.merchant_id', 'o.total_amount', 'o.order_type'])
        .take(50)
        .getMany();

      return {
        code: 200,
        message: 'success',
        data: {
          summary: {
            orderTotal: Number(orderTotal?.total || 0),
            orderCount: Number(orderTotal?.count || 0),
            recordTotal: Number(recordTotal?.total || 0),
            recordCount: Number(recordTotal?.count || 0),
            diff: Math.round((Number(orderTotal?.total || 0) - Number(recordTotal?.total || 0)) * 100) / 100,
          },
          merchantDiff,
          missingOrders: missingOrderIds,
        },
      };
    } catch (error) {
      return { code: 500, message: error.message, data: null };
    }
  }
}
