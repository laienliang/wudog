import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Between, In } from 'typeorm';
import { RoomCalendarEntity } from '../entity/room-calendar.entity';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';

@Provide()
@Scope(ScopeEnum.Singleton)
export class RoomCalendarService {
  @InjectEntityModel(RoomCalendarEntity)
  model: Repository<RoomCalendarEntity>;

  /**
   * 分页列表
   * 支持 roomId / accommodationId / dateFrom / dateTo 筛选
   */
  async list(query: IPageQuery): Promise<IPageResult<RoomCalendarEntity>> {
    const { page, pageSize } = parsePage(query);
    const where: FindOptionsWhere<RoomCalendarEntity> = { isDeleted: 0 };

    if (query.roomId) {
      where.roomId = Number(query.roomId);
    }
    if (query.accommodationId) {
      where.accommodationId = Number(query.accommodationId);
    }
    // 按日期区间筛选
    if (query.dateFrom && query.dateTo) {
      where.date = Between(query.dateFrom as string, query.dateTo as string) as any;
    }

    const [list, total] = await this.model.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { date: 'ASC' },
    });
    return pageResult(list, total, page, pageSize);
  }

  async detail(id: number): Promise<RoomCalendarEntity> {
    return this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<RoomCalendarEntity> });
  }

  /**
   * 批量查询某个住宿在指定日期区间内所有房型的库存与价格
   * 用于列表页按入住/离店日期筛选可用住宿
   */
  async queryByAccommodationAndDateRange(
    accommodationId: number,
    checkIn: string,
    checkOut: string,
  ): Promise<RoomCalendarEntity[]> {
    return this.model.find({
      where: {
        accommodationId,
        date: Between(checkIn, checkOut) as any,
        isDeleted: 0,
      },
      order: { date: 'ASC' },
    });
  }

  /**
   * 检查指定 accommodationId 列表在日期区间内是否有可用库存
   * 返回有库存的 accommodationId 集合
   */
  async filterAvailableAccommodations(
    accommodationIds: number[],
    checkIn: string,
    checkOut: string,
  ): Promise<number[]> {
    if (!accommodationIds.length) return [];

    // 查出在日期区间内有关闭或库存为0的记录
    const rows = await this.model
      .createQueryBuilder('rc')
      .select('rc.accommodation_id', 'accommodationId')
      .where('rc.accommodation_id IN (:...ids)', { ids: accommodationIds })
      .andWhere('rc.date >= :checkIn', { checkIn })
      .andWhere('rc.date < :checkOut', { checkOut })
      .andWhere('rc.is_deleted = 0')
      .andWhere('(rc.stock <= 0 OR rc.is_closed = 1)')
      .getRawMany();

    const unavailable = new Set(rows.map(r => Number(r.accommodationId)));
    return accommodationIds.filter(id => !unavailable.has(id));
  }

  async create(data: Partial<RoomCalendarEntity>): Promise<RoomCalendarEntity> {
    const entity = this.model.create(data);
    return this.model.save(entity);
  }

  /**
   * 批量创建/更新（upsert by room_id + date）
   */
  async batchUpsert(items: Partial<RoomCalendarEntity>[]): Promise<void> {
    for (const item of items) {
      const exist = await this.model.findOne({
        where: { roomId: item.roomId, date: item.date } as FindOptionsWhere<RoomCalendarEntity>,
      });
      if (exist) {
        await this.model.update(exist.id, { ...item, updatedAt: new Date() } as any);
      } else {
        await this.model.save(this.model.create(item));
      }
    }
  }

  async update(id: number, data: Partial<RoomCalendarEntity>): Promise<RoomCalendarEntity> {
    await this.model.update(id, { ...data, updatedAt: new Date() } as any);
    return this.detail(id);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('房态记录不存在或已删除');
    }
  }
}
