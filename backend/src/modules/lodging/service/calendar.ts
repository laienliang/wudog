// ============================================================
// 房态日历 Service — 查询 + 批量编辑库存/价格
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\calendar.ts
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
    return this.calendarRepo.find({
      where: {
        room_id: roomId,
        date: Between(startDate, endDate),
        is_deleted: 0,
      },
      order: { date: 'ASC' },
      relations: ['room'],
    });
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
      .leftJoinAndSelect('c.room', 'room')
      .where('c.is_deleted = 0');

    if (query.room_id) {
      qb.andWhere('c.room_id = :rid', { rid: query.room_id });
    }
    if (query.startDate && query.endDate) {
      qb.andWhere('c.date BETWEEN :start AND :end', {
        start: query.startDate,
        end: query.endDate,
      });
    }

    qb.orderBy('c.date', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { total, page, pageSize, list };
  }

  /**
   * ★ 业务接口2：批量修改日期库存/价格
   * PUT /api/lodging/room-calendar/batch-edit
   * 支持同时修改 available_stock / price / status，按日期范围批量更新
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

    // 校验房型存在
    const room = await this.roomRepo.findOneBy({ id: roomId, is_deleted: 0 }) as Room;
    if (!room) throw new Error('房型不存在');

    const updateData: any = {};
    if (availableStock !== undefined) updateData.available_stock = availableStock;
    if (price !== undefined) updateData.price = price;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      throw new Error('至少需要提供一个更新字段');
    }

    // 查询日期范围内已有的记录
    const existing = await this.calendarRepo.find({
      where: {
        room_id: roomId,
        date: Between(startDate, endDate),
        is_deleted: 0,
      },
    });

    const existingDateMap = new Map(existing.map(e => [e.date, e]));

    // 生成日期范围内的所有日期
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().slice(0, 10));
    }

    let affected = 0;

    // 批量更新已存在的记录
    if (existing.length > 0) {
      await this.calendarRepo
        .createQueryBuilder()
        .update(Calendar)
        .set(updateData)
        .where('room_id = :roomId', { roomId })
        .andWhere('date BETWEEN :start AND :end', { start: startDate, end: endDate })
        .andWhere('is_deleted = 0')
        .execute();
      affected += existing.length;
    }

    // 对于不存在的日期，新建记录
    const newDates = dates.filter(d => !existingDateMap.has(d));
    if (newDates.length > 0) {
      const inserts = newDates.map(date => ({
        room_id: roomId,
        date,
        available_stock: availableStock ?? room.default_stock,
        booked_stock: 0,
        price: price ?? room.base_price,
        status: status ?? 1,
      }));
      await this.calendarRepo
        .createQueryBuilder()
        .insert()
        .into(Calendar)
        .values(inserts)
        .orIgnore()
        .execute();
      affected += newDates.length;
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
    let record = await this.calendarRepo.findOneBy({
      room_id: params.roomId,
      date: params.date,
      is_deleted: 0,
    }) as Calendar;

    if (!record) {
      const room = await this.roomRepo.findOneBy({ id: params.roomId }) as Room;
      record = this.calendarRepo.create({
        room_id: params.roomId,
        date: params.date,
        available_stock: params.availableStock ?? room?.default_stock ?? 5,
        booked_stock: 0,
        price: params.price ?? room?.base_price ?? 0,
        status: params.status ?? 1,
      });
    } else {
      if (params.availableStock !== undefined) record.available_stock = params.availableStock;
      if (params.price !== undefined) record.price = params.price;
      if (params.status !== undefined) record.status = params.status;
    }

    return this.calendarRepo.save(record);
  }
}
