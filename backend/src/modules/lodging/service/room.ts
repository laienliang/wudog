// ============================================================
// 房型 Service
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\room.ts
// ============================================================
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entity/room';
import { HomestayService } from './homestay';
import { PaginatedResult } from '../../../interface';

@Provide()
export class RoomService {
  @InjectEntityModel(Room)
  roomRepo: Repository<Room>;

  @Inject()
  homestayService: HomestayService;

  /** 分页列表 */
  async list(query: {
    page?: number;
    pageSize?: number;
    homestay_id?: number;
  }): Promise<PaginatedResult<Room>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const qb = this.roomRepo
      .createQueryBuilder('r')
      .where('r.is_deleted = 0')
      .andWhere('r.status = 1');

    if (query.homestay_id) {
      qb.andWhere('r.homestay_id = :hid', { hid: query.homestay_id });
    }

    qb.orderBy('r.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { total, page, pageSize, list };
  }

  /** 详情 */
  async detail(id: number): Promise<Room | null> {
    return await this.roomRepo.findOneBy({ id, is_deleted: 0 }) as Room;
  }

  /** 新增 */
  async create(data: Partial<Room>): Promise<Room> {
    const entity = this.roomRepo.create(data);
    const saved = await this.roomRepo.save(entity);
    // 更新所属民宿最低价
    await this.homestayService.updateMinPrice(data.homestay_id!);
    return saved;
  }

  /** 编辑 */
  async update(data: Partial<Room> & { id: number }): Promise<Room> {
    await this.roomRepo.update(data.id, data);
    const room = await this.roomRepo.findOneBy({ id: data.id }) as Room;
    if (room) {
      await this.homestayService.updateMinPrice(room.homestay_id);
    }
    return room;
  }

  /** 软删除 */
  async softDelete(id: number): Promise<void> {
    const room = await this.roomRepo.findOneBy({ id }) as Room;
    await this.roomRepo.update(id, { is_deleted: 1 } as any);
    if (room) {
      await this.homestayService.updateMinPrice(room.homestay_id);
    }
  }
}
