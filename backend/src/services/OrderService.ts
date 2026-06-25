import { Repository, DataSource } from "typeorm";
import { TicketOrder, TicketType, RoutePackage } from "../entities";
import crypto from "crypto";

export class OrderService {
  constructor(
    private orderRepo: Repository<TicketOrder>,
    private ticketRepo: Repository<TicketType>,
    private routeRepo: Repository<RoutePackage>,
    private dataSource: DataSource,
  ) {}

  // ==================== 公开接口（游客） ====================

  /** 创建订单：门票或路线套餐 */
  async createOrder(params: {
    userId: number;
    orderType: number; // 1=门票 2=路线
    itemId: number;
    itemName: string;
    ticketTypeId?: number | null;
    quantity: number;
    totalPrice: number;
    visitDate?: string | null;
    validDays?: number;
  }) {
    const {
      userId,
      orderType,
      itemId,
      itemName,
      ticketTypeId = null,
      quantity,
      totalPrice,
      visitDate = null,
    } = params;

    // 输入校验（Issue #14）
    if (!userId || !orderType || !itemId || !itemName || quantity === undefined || quantity === null) {
      throw new Error("缺少必要参数");
    }
    if (quantity <= 0) throw new Error("数量必须大于0");
    if (typeof totalPrice !== "number" || totalPrice < 0) throw new Error("总金额不能为负数");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 检查库存（悲观锁，防止并发超卖 Issue #22）
      let stock = 0;
      if (orderType === 1) {
        const tt = await queryRunner.manager.findOne(TicketType, {
          where: { id: itemId, deletedAt: null },
          lock: { mode: "pessimistic_write" },
        });
        if (!tt) throw new Error("票种不存在");
        stock = visitDate ? tt.getStockForDate(visitDate) : tt.stock;
        if (stock < quantity) throw new Error("库存不足");
      } else if (orderType === 2) {
        const rp = await queryRunner.manager.findOne(RoutePackage, {
          where: { id: itemId, deletedAt: null },
          lock: { mode: "pessimistic_write" },
        });
        if (!rp) throw new Error("路线不存在");
        stock = visitDate ? rp.getStockForDate(visitDate) : rp.stock;
        if (stock < quantity) throw new Error("库存不足");
      } else {
        throw new Error("未知订单类型");
      }

      // 2. 检查重复下单
      if (orderType === 1 && visitDate) {
        const existing = await this.orderRepo.findOne({
          where: { userId, itemId, visitDate, status: 0 },
        });
        if (existing) {
          throw new Error("您已有该日期的未使用订单");
        }
      }

      // 3. 生成订单号和 UUID
      const orderNo = await this.generateOrderNo();
      const uuid = crypto.randomUUID();

      // 4. 有效期从实体派生（Issue #25：不可篡改）
      let validDays = 1;
      const validUntil = new Date();
      if (orderType === 1) {
        const tt = await this.ticketRepo.findOne({ where: { id: itemId, deletedAt: null } });
        if (tt) validDays = tt.validDays;
      } else if (orderType === 2) {
        const rp = await this.routeRepo.findOne({ where: { id: itemId, deletedAt: null } });
        if (rp) validDays = rp.durationDays;
      }
      validUntil.setDate(validUntil.getDate() + validDays);

      // 5. 扣减库存（在事务内）
      if (orderType === 1) {
        const tt = await queryRunner.manager.findOne(TicketType, {
          where: { id: itemId },
          lock: { mode: "pessimistic_write" },
        });
        if (tt) {
          if (visitDate && tt.dailyStock && tt.dailyStock[visitDate] !== undefined) {
            tt.dailyStock[visitDate] -= quantity;
          } else {
            tt.stock -= quantity;
          }
          await queryRunner.manager.save(tt);
        }
      }
      if (orderType === 2) {
        const rp = await queryRunner.manager.findOne(RoutePackage, {
          where: { id: itemId },
          lock: { mode: "pessimistic_write" },
        });
        if (rp) {
          if (visitDate && rp.dailyStock && rp.dailyStock[visitDate] !== undefined) {
            rp.dailyStock[visitDate] -= quantity;
          } else {
            rp.stock -= quantity;
          }
          await queryRunner.manager.save(rp);
        }
      }

      // 6. 创建订单
      const entity = this.orderRepo.create({
        orderNo,
        uuid,
        userId,
        orderType,
        itemId,
        itemName,
        ticketTypeId,
        quantity,
        totalPrice,
        visitDate,
        validUntil,
        status: 0,
      });

      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();

      return entity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getMyOrders(userId: number, page: number, pageSize: number) {
    const [list, total] = await this.orderRepo.findAndCount({
      where: { userId, deletedAt: null },
      order: { createdAt: "DESC" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async getOrderById(id: number) {
    return this.orderRepo.findOne({
      where: { id, deletedAt: null },
    });
  }

  async cancelOrder(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new Error("订单不存在");
    // Issue #23: 允许取消待使用(0)和已过期(2)的订单
    if (order.status !== 0 && order.status !== 2) {
      throw new Error("只能取消待使用或已过期的订单");
    }
    order.status = 3; // 已取消
    // 恢复库存
    await this.restoreStock(order.orderType, order.itemId, order.quantity, order.visitDate);
    return this.orderRepo.save(order);
  }

  async refundOrder(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new Error("订单不存在");
    if (order.status !== 0) {
      throw new Error("只能退款待使用订单");
    }
    order.status = 4; // 已退款
    // 恢复库存
    await this.restoreStock(order.orderType, order.itemId, order.quantity, order.visitDate);
    return this.orderRepo.save(order);
  }

  async verifyOrder(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new Error("订单不存在");
    if (order.status === 1) throw new Error("订单已核销"); // Issue #27
    if (order.status !== 0) throw new Error("订单状态异常");
    order.status = 1; // 已核销
    return this.orderRepo.save(order);
  }

  // ==================== 管理员接口 ====================

  async adminGetAll(page: number, pageSize: number, filters?: { status?: number; orderType?: number }) {
    const where: any = { deletedAt: null };
    if (filters?.status !== undefined) where.status = filters.status;
    if (filters?.orderType !== undefined) where.orderType = filters.orderType;

    const [list, total] = await this.orderRepo.findAndCount({
      where,
      order: { createdAt: "DESC" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  // ==================== 私有方法 ====================

  private async restoreStock(orderType: number, itemId: number, quantity: number, visitDate: string | null) {
    if (orderType === 1) {
      const tt = await this.ticketRepo.findOne({ where: { id: itemId } });
      if (!tt) return;
      if (visitDate && tt.dailyStock && tt.dailyStock[visitDate] !== undefined) {
        tt.dailyStock[visitDate] += quantity;
      } else {
        tt.stock += quantity;
      }
      await this.ticketRepo.save(tt);
    }
    if (orderType === 2) {
      const rp = await this.routeRepo.findOne({ where: { id: itemId } });
      if (!rp) return;
      if (visitDate && rp.dailyStock && rp.dailyStock[visitDate] !== undefined) {
        rp.dailyStock[visitDate] += quantity;
      } else {
        rp.stock += quantity;
      }
      await this.routeRepo.save(rp);
    }
  }

  private async generateOrderNo(): Promise<string> {
    // Issue #24: 排除已软删除的记录
    const last = await this.orderRepo.findOne({
      where: { deletedAt: null },
      order: { id: "DESC" },
    });
    const nextNum = last ? parseInt(last.orderNo) + 1 : 100001;
    return String(nextNum);
  }
}
