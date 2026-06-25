import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OrderEntity } from '../entity/order.entity';
import { AccommodationEntity } from '../entity/accommodation.entity';
import { RoomEntity } from '../entity/room.entity';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';

@Provide()
@Scope(ScopeEnum.Singleton)
export class OrderService {
  @InjectEntityModel(OrderEntity)
  model: Repository<OrderEntity>;

  @InjectEntityModel(AccommodationEntity)
  accommodationRepo: Repository<AccommodationEntity>;

  @InjectEntityModel(RoomEntity)
  roomRepo: Repository<RoomEntity>;

  /**
   * 生成订单编号: WD + 时间戳 + 4位随机数
   */
  generateOrderNo(): string {
    const ts = Date.now();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `WD${ts}${rand}`;
  }

  /**
   * 订单列表（分页）
   * 支持按 userId / accommodationId / status 筛选
   */
  async list(query: IPageQuery): Promise<IPageResult<OrderEntity>> {
    const { page, pageSize } = parsePage(query);
    const where: FindOptionsWhere<OrderEntity> = { isDeleted: 0 };

    if (query.userId) {
      where.userId = Number(query.userId);
    }
    if (query.accommodationId) {
      where.accommodationId = Number(query.accommodationId);
    }
    if (query.roomId) {
      where.roomId = Number(query.roomId);
    }
    if (query.status !== undefined && query.status !== '') {
      where.status = Number(query.status);
    }
    if (query.orderNo) {
      where.orderNo = query.orderNo as any;
    }

    const [list, total] = await this.model.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    // 关联住宿名和房型名
    const accIds = [...new Set(list.map(o => o.accommodationId))];
    const roomIds = [...new Set(list.map(o => o.roomId))];

    let accMap: Record<number, string> = {};
    let roomMap: Record<number, string> = {};

    if (accIds.length > 0) {
      const accommodations = await this.accommodationRepo.findByIds(accIds);
      accMap = Object.fromEntries(
        (accommodations || []).map(a => [a.id as number, a.name as string])
      );
    }
    if (roomIds.length > 0) {
      const rooms = await this.roomRepo.findByIds(roomIds);
      roomMap = Object.fromEntries(
        (rooms || []).map(r => [r.id as number, r.name as string])
      );
    }

    // 将关联名称附加到订单对象上（作为非实体字段）
    const enrichedList = list.map(order => {
      const plainOrder = order;
      (plainOrder as any).accommodationName = accMap[order.accommodationId] || '';
      (plainOrder as any).roomName = roomMap[order.roomId] || '';
      return plainOrder;
    });

    return pageResult(enrichedList, total, page, pageSize);
  }

  async detail(id: number): Promise<OrderEntity> {
    return this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<OrderEntity> });
  }

  async create(data: Partial<OrderEntity>): Promise<OrderEntity> {
    // 日期校验
    if (data.checkInDate && data.checkOutDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIn = new Date(data.checkInDate as any);
      const checkOut = new Date(data.checkOutDate as any);

      if (checkIn < today) {
        throw new Error('入住日期不能早于今天');
      }
      if (checkOut <= checkIn) {
        throw new Error('离店日期必须晚于入住日期');
      }
    }

    // 自动生成订单编号
    if (!data.orderNo) {
      data.orderNo = this.generateOrderNo();
    }
    // 自动计算入住晚数
    if (data.checkInDate && data.checkOutDate && !data.nights) {
      const diff = new Date(data.checkOutDate).getTime() - new Date(data.checkInDate).getTime();
      data.nights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    }
    const entity = this.model.create(data);
    return this.model.save(entity);
  }

  async update(id: number, data: Partial<OrderEntity>): Promise<OrderEntity> {
    await this.model.update(id, data as any);
    return this.detail(id);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('订单不存在或已删除');
    }
  }
}
