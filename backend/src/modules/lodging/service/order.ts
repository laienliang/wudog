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

/** 将 Date 格式化为 YYYY-MM-DD（本地时区，避免 toISOString 的 UTC 偏移） */
function fmtLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 生成两个日期之间的所有日期字符串（含 start，不含 end） */
function dateRangeStr(start: Date, end: Date): string[] {
  const list: string[] = [];
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
    list.push(fmtLocalDate(d));
  }
  return list;
}

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
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < this.lodgingConfig.checkInCodeLength; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * ★ 下单：扣减库存（事务性）
   * POST /api/lodging/orders
   */
  async create(dto: OrderCreateDTO, userId: number): Promise<Order> {
    const { homestay_id, room_id, check_in_date, check_out_date, room_count, contact_name, contact_phone, guest_count } = dto;

    // 1. 校验房型存在
    const room = await this.roomRepo.findOneBy({ id: room_id, is_deleted: 0, status: 1 }) as Room;
    if (!room) throw new Error('房型不存在或已下架');

    // 2. 校验日期（使用本地日期，避免时区偏移）
    const [cinY, cinM, cinD] = check_in_date.split('-').map(Number);
    const [coutY, coutM, coutD] = check_out_date.split('-').map(Number);
    const checkIn = new Date(cinY, cinM - 1, cinD);
    const checkOut = new Date(coutY, coutM - 1, coutD);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn.getTime() <= today.getTime()) throw new Error('入住日期必须晚于今天');
    if (checkOut.getTime() <= checkIn.getTime()) throw new Error('离店日期必须晚于入住日期');

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (nights < this.lodgingConfig.minStayNights) {
      throw new Error(`最少入住${this.lodgingConfig.minStayNights}晚`);
    }

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + this.lodgingConfig.maxAdvanceDays);
    if (checkIn > maxDate) {
      throw new Error(`最多提前${this.lodgingConfig.maxAdvanceDays}天预订`);
    }

    // 3. 生成日期列表（本地时区，不再用 toISOString）
    const dateList = dateRangeStr(checkIn, checkOut);

    // 4. 使用事务：锁定库存 + 扣减 + 创建订单
    return this.calendarRepo.manager.transaction(async (manager) => {
      // 4.1 悲观锁读取房态
      let calendarRows: Calendar[];
      try {
        calendarRows = await manager
          .createQueryBuilder(Calendar, 'c')
          .setLock('pessimistic_write')
          .where('c.room_id = :roomId', { roomId: room_id })
          .andWhere('c.booking_date IN (:...dates)', { dates: dateList })
          .orderBy('c.booking_date', 'ASC')
          .getMany();
      } catch (err: any) {
        throw new Error(`房态查询异常：${err.message || err}`);
      }

      // 4.2 检查每一天库存是否充足
      for (const dateStr of dateList) {
        const row = calendarRows.find(r => r.bookingDate === dateStr);
        if (!row) {
          throw new Error(`${dateStr} 未开放预订，请选择其他日期`);
        }
        if (row.status !== 1) {
          throw new Error(`${dateStr} 不可售（${row.status === 2 ? '满房' : '关房'}）`);
        }
        if (row.available_stock < room_count) {
          throw new Error(`${dateStr} 库存不足（剩余${row.available_stock}间，需要${room_count}间）`);
        }
      }

      // 4.3 计算总价
      let totalPrice = 0;
      for (const row of calendarRows) {
        const unitPrice = row.price ?? room.base_price;
        totalPrice += unitPrice * room_count;
      }

      // 4.4 创建订单（暂不扣库存，支付时再扣）
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

      try {
        return await manager.save(Order, order);
      } catch (err: any) {
        throw new Error(`创建订单失败：${err.message || err}`);
      }
    });
  }

  /** 分页列表 */
  async list(query: {
    page?: number;
    pageSize?: number;
    status?: number;
    userId?: number;
  }): Promise<PaginatedResult<Order>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .where('o.is_deleted = 0');

    if (query.status != null) {
      qb.andWhere('o.status = :status', { status: query.status });
    }
    if (query.userId != null) {
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
   * ★ 模拟支付 — 扣减库存 + 更新状态为已支付
   */
  async pay(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: orderId }) as Order;
    if (!order) throw new Error('订单不存在');
    if (Number(order.user_id) !== Number(userId)) throw new Error('无权操作此订单');
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new Error('订单状态不允许支付');
    }

    const room = await this.roomRepo.findOneBy({ id: order.room_id }) as Room;
    if (!room) throw new Error('房型不存在');

    const [cInY, cInM, cInD] = order.check_in_date.split('-').map(Number);
    const [cOutY, cOutM, cOutD] = order.check_out_date.split('-').map(Number);
    const cIn = new Date(cInY, cInM - 1, cInD);
    const cOut = new Date(cOutY, cOutM - 1, cOutD);
    const dateList = dateRangeStr(cIn, cOut);

    return this.calendarRepo.manager.transaction(async (manager) => {
      let calendarRows: Calendar[];
      try {
        calendarRows = await manager
          .createQueryBuilder(Calendar, 'c')
          .setLock('pessimistic_write')
          .where('c.room_id = :roomId', { roomId: order.room_id })
          .andWhere('c.booking_date IN (:...dates)', { dates: dateList })
          .orderBy('c.booking_date', 'ASC')
          .getMany();
      } catch (err: any) {
        throw new Error(`房态查询异常：${err.message || err}`);
      }

      // 再次校验库存
      for (const dateStr of dateList) {
        const row = calendarRows.find(r => r.bookingDate === dateStr);
        if (!row) throw new Error(`${dateStr} 未开放预订`);
        if (row.available_stock < order.room_count) {
          throw new Error(`${dateStr} 库存不足（剩余${row.available_stock}间）`);
        }
      }

      // 扣减库存
      for (const row of calendarRows) {
        row.available_stock -= order.room_count;
        row.bookedStock += order.room_count;
        if (row.available_stock <= 0) row.status = 2;
      }
      await manager.save(Calendar, calendarRows);

      // 更新订单状态
      await manager.update(Order, orderId, { status: OrderStatus.PAID } as any);
      order.status = OrderStatus.PAID;
      return order;
    });
  }

  /**
   * ★ 业务接口3：取消订单 — 返还库存 + 执行退改规则
   */
  async cancel(orderId: number, userId: number, reason?: string): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: orderId }) as Order;
    if (!order) throw new Error('订单不存在');

    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.REFUNDING ||
      order.status === OrderStatus.REFUNDED ||
      order.status === OrderStatus.COMPLETED
    ) {
      throw new Error(
        order.status === OrderStatus.COMPLETED
          ? '已完成的订单无法取消'
          : '订单已取消或已退款'
      );
    }

    if (Number(order.user_id) !== Number(userId)) {
      throw new Error('无权操作此订单');
    }

    const now = new Date();
    const [cinY, cinM, cinD] = order.check_in_date.split('-').map(Number);
    const checkInDate = new Date(cinY, cinM - 1, cinD);
    const daysUntilCheckIn = Math.ceil(
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const houseRule = await this.ruleRepo.findOneBy({
      homestay_id: order.homestay_id,
      is_deleted: 0,
    }) as HouseRule;
    const rules: CancellationRule[] =
      houseRule?.cancellation_rules || this.lodgingConfig.cancellationRules;

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

    // 返还库存（事务）— 仅订单已支付才需要返还（未支付从未扣库存）
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      await this.calendarRepo.manager.transaction(async (manager) => {
        const [cInY, cInM, cInD] = order.check_in_date.split('-').map(Number);
        const [cOutY, cOutM, cOutD] = order.check_out_date.split('-').map(Number);
        const cIn = new Date(cInY, cInM - 1, cInD);
        const cOut = new Date(cOutY, cOutM - 1, cOutD);
        const dateList = dateRangeStr(cIn, cOut);

        let calendarRows: Calendar[];
        try {
          calendarRows = await manager
            .createQueryBuilder(Calendar, 'c')
            .setLock('pessimistic_write')
            .where('c.room_id = :roomId', { roomId: order.room_id })
            .andWhere('c.booking_date IN (:...dates)', { dates: dateList })
            .getMany();
        } catch (err: any) {
          throw new Error(`返还库存查询异常：${err.message || err}`);
        }

        for (const row of calendarRows) {
          row.available_stock += order.room_count;
          row.bookedStock = Math.max(0, row.bookedStock - order.room_count);
          if (row.available_stock > 0 && row.status === 2) {
            row.status = 1;
          }
        }
        await manager.save(Calendar, calendarRows);

        // 在同一个事务内更新订单状态
        order.status =
          refundAmount > 0 ? OrderStatus.REFUNDING : OrderStatus.CANCELLED;
        order.cancel_time = new Date();
        order.cancel_reason = reason || '';
        order.cancel_status = cancelStatus;
        order.refund_amount = refundAmount;
        await manager.save(Order, order);
      });
    } else {
      // 未支付订单直接取消，无需返还库存
      order.status = OrderStatus.CANCELLED;
      order.cancel_time = new Date();
      order.cancel_reason = reason || '';
      order.cancel_status = CancelStatus.NONE;
      order.refund_amount = 0;
      await this.orderRepo.save(order);
    }

    return order;
  }

  /** 生成入住核销二维码字符串 */
  async getCheckInCode(orderId: number): Promise<{ checkInCode: string }> {
    const order = await this.orderRepo.findOneBy({ id: orderId }) as Order;
    if (!order) throw new Error('订单不存在');

    if (order.check_in_code) {
      return { checkInCode: order.check_in_code };
    }

    const code = this.generateCheckInCode();
    await this.orderRepo.update(orderId, { check_in_code: code } as any);
    return { checkInCode: code };
  }

  /** 订单状态流转（管理端） */
  async updateStatus(orderId: number, newStatus: number): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: orderId }) as Order;
    if (!order) throw new Error('订单不存在');

    const validTransitions: Record<number, number[]> = {
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
    const trimmedCode = (code || '').trim();
    if (!trimmedCode) throw new Error('核销码无效');
    const order = await this.orderRepo.findOneBy({
      check_in_code: trimmedCode,
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
