import { Provide, Scope, ScopeEnum, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AccommodationEntity } from '../entity/accommodation.entity';
import { RoomCalendarService } from './room-calendar.service';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';

@Provide()
@Scope(ScopeEnum.Singleton)
export class AccommodationService {
  @InjectEntityModel(AccommodationEntity)
  model: Repository<AccommodationEntity>;

  @Inject()
  roomCalendarService: RoomCalendarService;

  /**
   * 数据转换：解析 JSON 字符串字段为数组
   */
  private transform(item: AccommodationEntity): any {
    if (!item) return item;
    // 先序列化再反序列化，将 TypeORM entity 转成纯 JS 对象
    const data = JSON.parse(JSON.stringify(item));
    try { data.images = JSON.parse(data.images || '[]'); } catch { data.images = []; }
    try { data.facilities = JSON.parse(data.facilities || '[]'); } catch { data.facilities = []; }
    return data;
  }

  /**
   * 住宿/民宿列表（分页 + 搜索）
   * 支持按 name 关键词、villageId、type、价格区间筛选
   * 支持 checkIn / checkOut 入住日期筛选（基于 room_calendar 库存）
   */
  async list(query: IPageQuery): Promise<IPageResult<AccommodationEntity>> {
    const { page, pageSize } = parsePage(query);
    const where: FindOptionsWhere<AccommodationEntity> = { isDeleted: 0 };

    // 关键词搜索：民宿名称
    if (query.keyword) {
      where.name = Like(`%${query.keyword}%`);
    }
    // 按苗寨筛选
    if (query.villageId) {
      where.villageId = Number(query.villageId);
    }
    // 按类型筛选
    if (query.type) {
      where.type = query.type;
    }
    // 按状态筛选
    if (query.status !== undefined && query.status !== '') {
      where.status = Number(query.status);
    }
    // 价格区间
    if (query.minPrice !== undefined && query.maxPrice !== undefined) {
      where.lowestPrice = Between(Number(query.minPrice), Number(query.maxPrice));
    } else if (query.minPrice !== undefined) {
      where.lowestPrice = MoreThanOrEqual(Number(query.minPrice));
    } else if (query.maxPrice !== undefined) {
      where.lowestPrice = LessThanOrEqual(Number(query.maxPrice));
    }

    // 先不带分页捞全部符合条件的 id
    // 若传入了入住/离店日期，则通过 room_calendar 二次过滤有库存的住宿
    const checkIn = query.checkIn as string;
    const checkOut = query.checkOut as string;

    if (checkIn && checkOut) {
      // 先查全部符合基础条件的住宿 id（不分页）
      const allRows = await this.model.find({
        where,
        select: ['id'],
      });
      const allIds = allRows.map(r => r.id);

      if (allIds.length === 0) {
        return pageResult([], 0, page, pageSize);
      }

      // 通过 room_calendar 过滤有库存的住宿
      const availableIds = await this.roomCalendarService.filterAvailableAccommodations(
        allIds,
        checkIn,
        checkOut,
      );

      if (availableIds.length === 0) {
        return pageResult([], 0, page, pageSize);
      }

      // 对有库存的 id 分页查询
      const [list, total] = await this.model.findAndCount({
        where: { ...where, id: availableIds as any },
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' },
      });
      return pageResult(list.map(r => this.transform(r)), total, page, pageSize);
    }

    const [list, total] = await this.model.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return pageResult(list.map(r => this.transform(r)), total, page, pageSize);
  }

  async detail(id: number): Promise<AccommodationEntity> {
    const item = await this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<AccommodationEntity> });
    return this.transform(item) as any;
  }

  async create(data: Partial<AccommodationEntity>): Promise<AccommodationEntity> {
    const entity = this.model.create(data);
    const saved = await this.model.save(entity);
    return this.transform(saved) as any;
  }

  async update(id: number, data: Partial<AccommodationEntity>): Promise<AccommodationEntity> {
    await this.model.update(id, data as any);
    return this.detail(id);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('住宿不存在或已删除');
    }
  }
}
