// ============================================================
// 住宿订单 Service — 下单扣库存 + 取消返还库存 + 核销码 + 退改规则
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\order.ts
// ============================================================
import { Provide, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { Order } from '../entity/order';
import { Calendar } from '../entity/calendar';
import { Room } from '../entity/room';
import { HouseRule } from '../entity/house-rule';
import { OrderCreateDTO } from '../dto/order';
import {
  PaginatedResult,
  OrderStatus,
  CancelStatus,
  CancellationRule,
} from '../../../interface';

@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  @InjectEntityModel(Calendar)
  calendarRepo: Repository<Calendar>;

  @InjectEntityModel(Room)
  roomRepo: Repository<Room>;

  @InjectEntityModel(HouseRule)
  ruleRepo: Repository<HouseRule>;

  @Config('lodging')
  lodgingConfig: {
    maxAdvanceDays: number;
    minStayNights: number;
    checkInCodeLength: number;
    cancellationRules: CancellationRule[];
  };

  /** 生成订单号：WD + 时间戳 + 随机6位 */
  private generateOrderNo(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `WD${ts}${rand}`;
  }

  /** 生成核销码：6位随机字母数字 */
  private generateCheckInCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符 0/O/1/I
    let code = '';
    for (let i = 0; i < this.lodgingConfig.checkInCodeLength; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * ★ 下单：扣减库存（事务性）
   * POST /api/lodging/orders
   * 1. 校验房型和日期范围
   * 2. 锁定库存 SELECT FOR UPDATE
   * 3. 计算总价
   * 4. 创建订单
   */
  async create(dto: OrderCreateDTO, userId: number): Promise<Order> {
    const { homestay_id, room_id, check_in_date, check_out_date, room_count, contact_name, contact_phone, guest_count } = dto;

    // 1. 校验房型存在
    const room = await this.roomRepo.findOneBy({ id: room_id, is_deleted: 0, status: 1 }) as Room;
    if (!room) throw new Error('房型不存在或已下架');

    // 2. 校验日期
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn <= today) throw new Error('入住日期必须晚于今天');
    if (checkOut <= checkIn) throw new Error('离店日期必须晚于入住日期');

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (nights < this.lodgingConfig.minStayNights) {
      throw new Error(`最少入住${this.lodgingConfig.minStayNights}晚`);
    }

    // 最多提前90天
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + this.lodgingConfig.maxAdvanceDays);
    if (checkIn > maxDate) {
      throw new Error(`最多提前${this.lodgingConfig.maxAdvanceDays}天预订`);
    }

    // 3. 生成日期列表
    const dateList: string[] = [];
    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      dateList.push(d.toISOString().slice(0, 10));
    }

    // 4. 使用事务：锁定库存 + 扣减 + 创建订单
    return this.calendarRepo.manager.transaction(async (manager) => {
      // 4.1 悲观锁读取房态
      const calendarRows = await manager
        .createQueryBuilder(Calendar, 'c')
        .setLock('pessimistic_write')
        .where('c.room_id = :roomId', { roomId: room_id })
        .andWhere('c.date IN (:...dates)', { dates: dateList })
        .andWhere('c.is_deleted = 0')
        .orderBy('c.date', 'ASC')
        .getMany();

      // 4.2 检查每一天库存是否充足
      for (const dateStr of dateList) {
        const row = calendarRows.find(r => r.date === dateStr);
        if (!row) {
          throw new Error(`${dateStr} 未开放预订`);
        }
        if (row.status !== 1) {
          throw new Error(`${dateStr} 不可售（${row.status === 2 ? '满房' : '关房'}）`);
        }
        if (row.available_stock < room_count) {
          throw new Error(`${dateStr} 库存不足（剩余${row.available_stock}间，需要${room_count}间）`);
        }
      }

      // 4.3 计算总价（取每行实际价格或房型基础价）
      let totalPrice = 0;
      for (const row of calendarRows) {
        const unitPrice = row.price ?? room.base_price;
        totalPrice += unitPrice * room_count;
      }

      // 4.4 扣减库存
      for (const row of calendarRows) {
        row.available_stock -= room_count;
        row.booked_stock += room_count;
        if (row.available_stock <= 0) {
          row.status = 2; // 满房
        }
      }
      await manager.save(Calendar, calendarRows);

      // 4.5 创建订单
      const order = manager.create(Order, {
        order_no: this.generateOrderNo(),
        user_id: userId,
        homestay_id,
        room_id,
        check_in_date,
        check_out_date,
        nights,
        room_count,
        total_price: Math.round(totalPrice * 100) / 100,
        status: OrderStatus.PENDING_PAYMENT,
        contact_name,
        contact_phone,
        guest_count,
        check_in_code: this.generateCheckInCode(),
        cancel_status: CancelStatus.NONE,
      });

      return manager.save(Order, order);
    });
  }

  /** 分页列表 */
  async list(query: {
    page?: number;
    pageSize?: number;
    status?: string;
    userId?: number;
  }): Promise<PaginatedResult<Order>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .where('o.is_deleted = 0');

    if (query.status) {
      qb.andWhere('o.status = :status', { status: query.status });
    }
    if (query.userId) {
      qb.andWhere('o.user_id = :uid', { uid: query.userId });
    }

    qb.orderBy('o.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { total, page, pageSize, list };
  }

  /** 详情 */
  async detail(id: number): Promise<Order | null> {
    return await this.orderRepo.findOneBy({ id, is_deleted: 0 }) as Order;
  }

  /**
   * ★ 业务接口3：取消订单 — 返还库存 + 执行退改规则
   * POST /api/lodging/order/cancel
   * 退改规则：
   *  - 入住前3天以上：全额退
   *  - 入住前1-3天：退50%
   *  - 入住前24h内：不可退
   */
  async cancel(orderId: number, userId: number, reason?: string): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: orderId, is_deleted: 0 }) as Order;
    if (!order) throw new Error('订单不存在');

    // 已取消/已完成的订单不可再次取消
    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.REFUNDING ||
      order.status === OrderStatus.REFUNDED
    ) {
      throw new Error('订单已取消或已退款');
    }

    // 校验权限：仅订单所属用户可取消
    if (order.user_id !== userId) {
      throw new Error('无权操作此订单');
    }

    // 计算退款金额（基于退改规则）
    const now = new Date();
    const checkInDate = new Date(order.check_in_date);
    const daysUntilCheckIn = Math.ceil(
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 获取民宿的退改规则，若无则使用默认规则
    const houseRule = await this.ruleRepo.findOneBy({
      homestay_id: order.homestay_id,
      is_deleted: 0,
    }) as HouseRule;
    const rules: CancellationRule[] =
      houseRule?.cancellation_rules || this.lodgingConfig.cancellationRules;

    // 按 daysBefore 降序排列，匹配第一条满足条件的规则
    const sortedRules = [...rules].sort((a, b) => b.daysBefore - a.daysBefore);
    const matchedRule = sortedRules.find(r => daysUntilCheckIn >= r.daysBefore);

    const refundPercent = matchedRule ? matchedRule.refundPercent : 0;
    const refundAmount = Math.round(order.total_price * refundPercent) / 100;
    const cancelStatus =
      refundPercent >= 100
        ? CancelStatus.FULL
        : refundPercent > 0
        ? CancelStatus.PARTIAL
        : CancelStatus.DENIED;

    // 返还库存（事务）
    await this.calendarRepo.manager.transaction(async (manager) => {
      // 生成日期列表
      const dateList: string[] = [];
      const cIn = new Date(order.check_in_date);
      const cOut = new Date(order.check_out_date);
      for (let d = new Date(cIn); d < cOut; d.setDate(d.getDate() + 1)) {
        dateList.push(d.toISOString().slice(0, 10));
      }

      // 返还库存
      const calendarRows = await manager
        .createQueryBuilder(Calendar, 'c')
        .setLock('pessimistic_write')
        .where('c.room_id = :roomId', { roomId: order.room_id })
        .andWhere('c.date IN (:...dates)', { dates: dateList })
        .andWhere('c.is_deleted = 0')
        .getMany();

      for (const row of calendarRows) {
        row.available_stock += order.room_count;
        row.booked_stock = Math.max(0, row.booked_stock - order.room_count);
        if (row.available_stock > 0 && row.status === 2) {
          row.status = 1; // 恢复可售
        }
      }
      await manager.save(Calendar, calendarRows);

      // 更新订单状态
      order.status =
        refundAmount > 0 ? OrderStatus.REFUNDING : OrderStatus.CANCELLED;
      order.cancel_time = new Date();
      order.cancel_reason = reason || '';
      order.cancel_status = cancelStatus;
      order.refund_amount = refundAmount;
      await manager.save(Order, order);
    });

    return order;
  }

  /**
   * ★ 业务接口4：生成入住核销二维码字符串
   * GET /api/lodging/order/check-in-code/:id
   * 如果已有核销码则返回，否则生成新的
   */
  async getCheckInCode(orderId: number): Promise<{ checkInCode: string }> {
    const order = await this.orderRepo.findOneBy({ id: orderId, is_deleted: 0 }) as Order;
    if (!order) throw new Error('订单不存在');

    if (order.check_in_code) {
      return { checkInCode: order.check_in_code };
    }

    // 重新生成
    const code = this.generateCheckInCode();
    await this.orderRepo.update(orderId, { check_in_code: code } as any);
    return { checkInCode: code };
  }

  /** 订单状态流转（管理端） */
  async updateStatus(
    orderId: number,
    newStatus: string
  ): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: orderId, is_deleted: 0 }) as Order;
    if (!order) throw new Error('订单不存在');

    // 状态流转校验
    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.CHECKING_IN, OrderStatus.CANCELLED],
      [OrderStatus.CHECKING_IN]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDING]: [OrderStatus.REFUNDED],
      [OrderStatus.REFUNDED]: [],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`不允许从 ${order.status} 变更为 ${newStatus}`);
    }

    await this.orderRepo.update(orderId, { status: newStatus } as any);
    return await this.orderRepo.findOneBy({ id: orderId }) as Order;
  }

  /** 核销：验证核销码并标记入住 */
  async verifyCheckIn(code: string): Promise<Order> {
    const order = await this.orderRepo.findOneBy({
      check_in_code: code,
      is_deleted: 0,
    }) as Order;
    if (!order) throw new Error('核销码无效');

    if (order.status === OrderStatus.CHECKING_IN || order.status === OrderStatus.COMPLETED) {
      throw new Error('该订单已核销');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new Error(`订单状态为 ${order.status}，不可核销`);
    }

    order.status = OrderStatus.CHECKING_IN;
    order.check_in_time = new Date();
    return this.orderRepo.save(order);
  }

  /** 软删除 */
  async softDelete(id: number): Promise<void> {
    await this.orderRepo.update(id, { is_deleted: 1 } as any);
  }
}
