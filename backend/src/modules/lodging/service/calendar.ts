// ============================================================
// 房态日历 Service — 查询 + 批量编辑库存/价格
// (is_deleted/status/booked_stock 为运行时字段，DB 暂无)
// ============================================================
import { Provide, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Calendar } from '../entity/calendar';
import { Room } from '../entity/room';
import { PaginatedResult } from '../../../interface';

@Provide()
export class CalendarService {
  @InjectEntityModel(Calendar)
  calendarRepo: Repository<Calendar>;

  @InjectEntityModel(Room)
  roomRepo: Repository<Room>;

  @Config('lodging')
  lodgingConfig: { maxAdvanceDays: number; minStayNights: number };

  /** 查询某房型某日期范围的房态 */
  async query(roomId: number, startDate: string, endDate: string): Promise<Calendar[]> {
    const results = await this.calendarRepo.find({
      where: {
        room_id: roomId,
        bookingDate: Between(startDate, endDate),
      },
      order: { bookingDate: 'ASC' },
      relations: ['room'],
    });

    // ★ 消除 MySQL DECIMAL → JS Number 转换的浮点精度尾数
    // 例如 299.99 在 IEEE 754 下可能变成 299.9899999999
    // 在数据源头用 parseFloat(toFixed(2)) 截断尾数，保证返回前端前已干净
    for (const c of results) {
      if (c.price != null) {
        c.price = parseFloat(Number(c.price).toFixed(2));
      }
    }
    return results;
  }

  /** 分页列表（管理后台） */
  async list(query: {
    page?: number;
    pageSize?: number;
    room_id?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResult<Calendar>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const qb = this.calendarRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.room', 'room');

    if (query.room_id) {
      qb.andWhere('c.room_id = :rid', { rid: query.room_id });
    }
    if (query.startDate && query.endDate) {
      qb.andWhere('c.booking_date BETWEEN :start AND :end', {
        start: query.startDate,
        end: query.endDate,
      });
    }

    qb.orderBy('c.booking_date', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { total, page, pageSize, list };
  }

  /**
   * 批量修改日期库存/价格
   */
  async batchEdit(params: {
    roomId: number;
    startDate: string;
    endDate: string;
    availableStock?: number;
    price?: number;
    status?: number;
  }): Promise<{ affected: number }> {
    const { roomId, startDate, endDate, availableStock, price, status } = params;

    const room = await this.roomRepo.findOneBy({ id: roomId }) as Room;
    if (!room) throw new Error('房型不存在');

    const updateData: Record<string, any> = {};
    if (availableStock !== undefined) updateData.available_stock = availableStock;
    if (price !== undefined) updateData.price = price;
    // status 为运行时字段，不写入 updateData（DB 无此列）
    if (status !== undefined) updateData._runtimeStatus = status;

    if (!updateData.available_stock && !updateData.price && !updateData._runtimeStatus) {
      if (Object.keys(updateData).filter(k => k !== '_runtimeStatus').length === 0)
        throw new Error('至少需要提供一个更新字段');
    }
    delete updateData._runtimeStatus;

    if (Object.keys(updateData).length === 0) {
      throw new Error('至少需要提供一个更新字段');
    }

    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().slice(0, 10));
    }
    if (dates.length === 0) throw new Error('日期范围无效');

    let affected = 0;

    let existing: Calendar[] = [];
    try {
      existing = await this.calendarRepo.find({
        where: {
          room_id: roomId,
          bookingDate: Between(startDate, endDate),
        },
      });
    } catch (err: any) {
      throw new Error(`查询已有房态失败：${err.message || err}`);
    }

    const existingDateMap = new Map(existing.map(e => [e.bookingDate, e]));

    if (existing.length > 0) {
      try {
        const result = await this.calendarRepo
          .createQueryBuilder()
          .update(Calendar)
          .set(updateData)
          .where('room_id = :roomId', { roomId })
          .andWhere('booking_date BETWEEN :start AND :end', { start: startDate, end: endDate })
          .execute();
        affected += result.affected ?? existing.length;
      } catch (err: any) {
        throw new Error(`批量更新房态失败：${err.message || err}`);
      }
    }

    const newDates = dates.filter(d => !existingDateMap.has(d));
    if (newDates.length > 0) {
      const inserts = newDates.map(d => ({
        room_id: roomId,
        bookingDate: d,
        available_stock: availableStock ?? room.default_stock,
        price: price ?? room.base_price,
      }));
      try {
        const insertResult = await this.calendarRepo
          .createQueryBuilder()
          .insert()
          .into(Calendar)
          .values(inserts)
          .orIgnore()
          .execute();
        affected += insertResult.raw?.affectedRows ?? newDates.length;
      } catch (err: any) {
        throw new Error(`新增房态日期失败：${err.message || err}`);
      }
    }

    // 运行时更新 status（不持久化）
    if (status !== undefined) {
      existing.forEach(e => { e.status = status; });
    }

    return { affected };
  }

  /** 单日编辑 */
  async singleEdit(params: {
    roomId: number;
    date: string;
    availableStock?: number;
    price?: number;
    status?: number;
  }): Promise<Calendar> {
    let record: Calendar | null = null;
    try {
      record = await this.calendarRepo.findOneBy({
        room_id: params.roomId,
        bookingDate: params.date,
      }) as Calendar | null;
    } catch (err: any) {
      throw new Error(`查询房态记录失败：${err.message || err}`);
    }

    if (!record) {
      let room: Room | null = null;
      try {
        room = await this.roomRepo.findOneBy({ id: params.roomId }) as Room | null;
      } catch (err: any) {
        throw new Error(`查询房型失败：${err.message || err}`);
      }
      if (!room) throw new Error('房型不存在');

      record = this.calendarRepo.create({
        room_id: params.roomId,
        bookingDate: params.date,
        available_stock: params.availableStock ?? room.default_stock,
        price: params.price ?? room.base_price,
      });
    } else {
      if (params.availableStock !== undefined) record.available_stock = params.availableStock;
      if (params.price !== undefined) record.price = params.price;
    }
    if (params.status !== undefined) record.status = params.status;

    try {
      return await this.calendarRepo.save(record);
    } catch (err: any) {
      throw new Error(`保存房态失败：${err.message || err}`);
    }
  }
}
