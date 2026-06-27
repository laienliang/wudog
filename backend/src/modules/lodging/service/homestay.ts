// ============================================================
// 民宿 Service — CRUD + 按日期/价格/设施搜索
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\homestay.ts
// ============================================================
import { Provide, Inject, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Between, In, Like, SelectQueryBuilder } from 'typeorm';
import { Homestay } from '../entity/homestay';
import { Calendar } from '../entity/calendar';
import { Room } from '../entity/room';
import { HomestaySearchDTO } from '../dto/homestay';
import { PaginatedResult } from '../../../interface';

@Provide()
export class HomestayService {
  @InjectEntityModel(Homestay)
  homestayRepo: Repository<Homestay>;

  @InjectEntityModel(Calendar)
  calendarRepo: Repository<Calendar>;

  @InjectEntityModel(Room)
  roomRepo: Repository<Room>;

  @Config('lodging')
  lodgingConfig: { maxAdvanceDays: number; minStayNights: number };

  /** 分页列表 */
  async list(query: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: number;
    sort?: string;
  }): Promise<PaginatedResult<Homestay>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const qb = this.homestayRepo
      .createQueryBuilder('h')
      .where('h.is_deleted = 0');

    if (query.status !== undefined && query.status !== null) {
      qb.andWhere('h.status = :status', { status: query.status });
    } else {
      qb.andWhere('h.status = 1'); // 默认只查上架
    }

    if (query.keyword) {
      qb.andWhere('(h.name LIKE :kw OR h.address LIKE :kw)', { kw: `%${query.keyword}%` });
    }

    // 排序
    switch (query.sort) {
      case 'price_asc':
        qb.orderBy('h.min_price', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('h.min_price', 'DESC');
        break;
      case 'rating_desc':
        qb.orderBy('h.rating', 'DESC');
        break;
      default:
        qb.orderBy('h.id', 'DESC');
    }

    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { total, page, pageSize, list };
  }

  /** 详情 */
  async detail(id: number): Promise<Homestay | null> {
    return await this.homestayRepo.findOne({
      where: { id, is_deleted: 0 },
      relations: ['rooms', 'house_rules'],
    }) as Homestay;
  }

  /** 新增 */
  async create(data: Partial<Homestay>): Promise<Homestay> {
    const entity = this.homestayRepo.create(data);
    return this.homestayRepo.save(entity);
  }

  /** 编辑 — 强制类型断言，绕过null校验 */
  async update(data: Partial<Homestay> & { id: number }): Promise<Homestay> {
    await this.homestayRepo.update(data.id, data);
    const row = await this.homestayRepo.findOneBy({ id: data.id }) as Homestay;
    return row;
  }

  /** 软删除 */
  async softDelete(id: number): Promise<void> {
    await this.homestayRepo.update(id, { is_deleted: 1 } as any);
  }

  /**
   * ★ 业务接口1：按入住/离店日期+价格+设施筛选民宿
   * GET /api/lodging/motel/search
   * 逻辑：找到在日期范围内每天都有库存（available_stock > 0 且 status=1）的房型所属民宿
   */
  async searchByDate(dto: HomestaySearchDTO): Promise<PaginatedResult<Homestay>> {
    const { checkInDate, checkOutDate, minPrice, maxPrice, facilities, page, pageSize } = dto;
    const pageNum = page || 1;
    const pageSizeNum = pageSize || 20;

    // 1. 计算所需天数
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const requiredNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const dateList: string[] = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dateList.push(d.toISOString().slice(0, 10));
    }

    // 2. 找到在所需日期范围内每天都有可售库存的房型ID
    //    每天: available_stock > 0 且 status = 1
    const placeholders = dateList.map(() => '?').join(', ');
    const rawSQL = `
      SELECT c.room_id
      FROM calendar c
      WHERE c.date IN (${placeholders})
        AND c.is_deleted = 0
        AND c.available_stock > 0
        AND c.status = 1
      GROUP BY c.room_id
      HAVING COUNT(DISTINCT c.date) = ?
    `;

    interface RawRow { room_id: number; }
    const availableRows: RawRow[] = await this.calendarRepo.query(rawSQL, [
      ...dateList,
      requiredNights,
    ]);
    const availableRoomIds = availableRows.map((r: RawRow) => r.room_id);

    if (availableRoomIds.length === 0) {
      return { total: 0, page: pageNum, pageSize: pageSizeNum, list: [] };
    }

    // 3. 找到这些房型对应的民宿ID
    const rooms = await this.roomRepo.find({
      where: { id: In(availableRoomIds), is_deleted: 0, status: 1 },
      select: ['homestay_id', 'base_price'],
    });
    let homestayIds = [...new Set(rooms.map(r => r.homestay_id))];

    // 4. 按价格范围过滤（取房型的最低base_price）
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceMap = new Map<number, number>();
      for (const r of rooms) {
        const currentMin = priceMap.get(r.homestay_id);
        if (currentMin === undefined || r.base_price < currentMin) {
          priceMap.set(r.homestay_id, r.base_price);
        }
      }
      homestayIds = homestayIds.filter(hid => {
        const p = priceMap.get(hid) || 0;
        if (minPrice !== undefined && p < minPrice) return false;
        if (maxPrice !== undefined && p > maxPrice) return false;
        return true;
      });
    }

    if (homestayIds.length === 0) {
      return { total: 0, page: pageNum, pageSize: pageSizeNum, list: [] };
    }

    // 5. 构建查询
    const qb = this.homestayRepo
      .createQueryBuilder('h')
      .where('h.is_deleted = 0')
      .andWhere('h.status = 1')
      .andWhere('h.id IN (:...ids)', { ids: homestayIds });

    // 设施筛选
    if (facilities && facilities.length > 0) {
      for (const f of facilities) {
        qb.andWhere('JSON_CONTAINS(h.facilities, :f)', { f: JSON.stringify(f) });
      }
    }

    qb.orderBy('h.rating', 'DESC')
      .skip((pageNum - 1) * pageSizeNum)
      .take(pageSizeNum);

    const [list, total] = await qb.getManyAndCount();
    return { total, page: pageNum, pageSize: pageSizeNum, list };
  }

  /** 更新民宿最低价格（当房型价格变化时调用） */
  async updateMinPrice(homestayId: number): Promise<void> {
    const result = await this.roomRepo
      .createQueryBuilder('r')
      .select('MIN(r.base_price)', 'minPrice')
      .where('r.homestay_id = :hid', { hid: homestayId })
      .andWhere('r.is_deleted = 0')
      .andWhere('r.status = 1')
      .getRawOne();

    await this.homestayRepo.update(homestayId, {
      min_price: result?.minPrice || 0,
    } as any);
  }

  /** 更新民宿评分（当有新评价时调用） */
  async updateRating(homestayId: number): Promise<void> {
    const result = await this.calendarRepo.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as cnt
       FROM review
       WHERE homestay_id = ? AND is_deleted = 0 AND status = 1`,
      [homestayId]
    );
    if (result?.[0]) {
      await this.homestayRepo.update(homestayId, {
        rating: Math.round(result[0].avg_rating * 10) / 10 || 5.0,
        review_count: result[0].cnt || 0,
      } as any);
    }
  }
}