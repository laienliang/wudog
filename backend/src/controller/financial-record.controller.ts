import { Controller, Post, Get, Inject, Query, Body, Param } from '@midwayjs/decorator';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@midwayjs/swagger';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialRecordService } from '../service/financial-record.service';
import { Order } from '../entity/order.entity';
import { FinancialRecord } from '../entity/financial-record.entity';
import { Merchant } from '../entity/merchant.entity';

/**
 * 财务记录控制器
 * 处理财务记录相关的 API 请求，包括财务记录的查询和结算操作
 */
@ApiTags('FinancialRecord')
@ApiBearerAuth()
@Controller('/api/financial-records')
export class FinancialRecordController {
  @Inject()
  financialRecordService: FinancialRecordService;

  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  @InjectEntityModel(FinancialRecord)
  recordRepo: Repository<FinancialRecord>;

  @InjectEntityModel(Merchant)
  merchantRepo: Repository<Merchant>;

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
  @ApiOperation({ summary: '获取财务记录列表（分页）' })
  @ApiQuery({ name: 'page', description: '页码', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false, example: 20 })
  @ApiQuery({ name: 'merchantId', description: '商家ID筛选', required: false, example: 1 })
  @ApiQuery({ name: 'settlementStatus', description: '结算状态筛选（pending/settled）', required: false, example: 'pending' })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          list: [
            {
              id: 1,
              order_id: 1001,
              order_no: 'ORD20260621001',
              merchant_id: 1,
              order_amount: 299.00,
              commission_rate: 0.10,
              commission_amount: 29.90,
              merchant_income: 269.10,
              settlement_status: 'pending',
              created_at: '2026-06-21 10:00:00',
            },
          ],
          total: 50,
        },
      },
    },
  })
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
  @ApiOperation({ summary: '获取财务记录详情' })
  @ApiParam({ name: 'id', description: '财务记录ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          id: 1,
          order_id: 1001,
          order_no: 'ORD20260621001',
          merchant_id: 1,
          order_amount: 299.00,
          commission_rate: 0.10,
          commission_amount: 29.90,
          merchant_income: 269.10,
          settlement_status: 'pending',
          created_at: '2026-06-21 10:00:00',
        },
      },
    },
  })
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
  @ApiOperation({ summary: '单笔结算' })
  @ApiParam({ name: 'id', description: '财务记录ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '结算成功',
    schema: {
      example: {
        code: 200,
        message: '结算成功',
        data: {
          id: 1,
          order_id: 1001,
          order_no: 'ORD20260621001',
          merchant_id: 1,
          order_amount: 299.00,
          commission_rate: 0.10,
          commission_amount: 29.90,
          merchant_income: 269.10,
          settlement_status: 'settled',
          settled_at: '2026-06-21 12:00:00',
        },
      },
    },
  })
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
  @ApiOperation({ summary: '批量结算' })
  @ApiBody({
    schema: {
      properties: {
        ids: { type: 'array', items: { type: 'number' }, description: '财务记录ID数组', example: [1, 2, 3] },
      },
      example: {
        ids: [1, 2, 3],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '批量结算成功',
    schema: {
      example: {
        code: 200,
        message: '批量结算成功',
        data: {
          settledCount: 3,
          settledIds: [1, 2, 3],
        },
      },
    },
  })
  async settleBatch(@Body() body: { ids: number[] }) {
    const result = await this.financialRecordService.settleBatch(body.ids);
    return { code: 200, message: '批量结算成功', data: result };
  }

  /**
   * 自动生成结算单
   * POST /api/financial-records/generate
   * @param body - 可选 orderIds（指定订单ID列表，仅为这些订单生成；不指定则扫描所有已完成订单）
   */
  @Post('/generate')
  @ApiOperation({ summary: '自动生成结算单' })
  @ApiBody({
    schema: {
      properties: {
        orderIds: { type: 'array', items: { type: 'number' }, description: '指定订单ID列表（可选，不传则扫描所有已完成订单）', example: [1001, 1002] },
      },
      example: {
        orderIds: [1001, 1002],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '生成成功',
    schema: {
      example: {
        code: 200,
        message: '成功生成 2 条结算单，跳过 0 条已有记录',
        data: {
          generated: 2,
          skipped: 0,
        },
      },
    },
  })
  async generate(@Body() body: { orderIds?: number[] }) {
    try {
      const result = await this.financialRecordService.generateSettlementBills(body?.orderIds);
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
  @ApiOperation({ summary: '获取财务汇总数据' })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          total_revenue: 158000.00,
          platform_income: 15800.00,
          merchant_income: 142200.00,
          pending_settlement: 28500.00,
        },
      },
    },
  })
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
  @ApiOperation({ summary: '获取商家收入汇总' })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: [
          {
            merchant_id: 1,
            merchant_name: '苗寨风情客栈',
            order_count: 25,
            total_amount: 8500.00,
            commission_amount: 850.00,
            merchant_income: 7650.00,
            pending_amount: 1200.00,
          },
          {
            merchant_id: 2,
            merchant_name: '侗乡酸汤鱼馆',
            order_count: 18,
            total_amount: 5200.00,
            commission_amount: 520.00,
            merchant_income: 4680.00,
            pending_amount: 0,
          },
        ],
      },
    },
  })
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

      // 查询所有涉及商家的真实店铺名
      const merchantIds = Array.from(merchantMap.keys()).filter(Boolean);
      if (merchantIds.length > 0) {
        const merchants = await this.merchantRepo
          .createQueryBuilder('m')
          .select(['m.id', 'm.shop_name'])
          .whereInIds(merchantIds)
          .getMany();
        merchants.forEach(m => {
          if (merchantMap.has(m.id)) {
            merchantMap.get(m.id).merchant_name = m.shop_name;
          }
        });
      }

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
  @ApiOperation({ summary: '对账接口' })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      example: {
        code: 200,
        message: 'success',
        data: {
          summary: {
            orderTotal: 158000.00,
            orderCount: 320,
            recordTotal: 152000.00,
            recordCount: 310,
            diff: 6000.00,
          },
          merchantDiff: [
            {
              merchantId: 1,
              orderCount: 25,
              orderAmount: 8500.00,
              recordCount: 25,
              recordAmount: 8500.00,
              diff: 0,
              status: 'matched',
            },
            {
              merchantId: 3,
              orderCount: 10,
              orderAmount: 3200.00,
              recordCount: 0,
              recordAmount: 0,
              diff: 3200.00,
              status: 'missing_records',
            },
          ],
          missingOrders: [
            {
              id: 1050,
              order_no: 'ORD20260620050',
              merchant_id: 3,
              total_amount: 320.00,
              order_type: 'accommodation',
            },
          ],
        },
      },
    },
  })
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
