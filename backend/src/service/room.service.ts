import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { RoomEntity } from '../entity/room.entity';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';

@Provide()
@Scope(ScopeEnum.Singleton)
export class RoomService {
  @InjectEntityModel(RoomEntity)
  model: Repository<RoomEntity>;

  /**
   * 房型列表（分页 + 搜索）
   * 支持按 accommodationId 筛选某住宿下的所有房型
   */
  async list(query: IPageQuery): Promise<IPageResult<RoomEntity>> {
    const { page, pageSize } = parsePage(query);
    const where: FindOptionsWhere<RoomEntity> = { isDeleted: 0 };

    if (query.keyword) {
      where.name = Like(`%${query.keyword}%`);
    }
    if (query.accommodationId) {
      where.accommodationId = Number(query.accommodationId);
    }
    if (query.status !== undefined && query.status !== '') {
      where.status = Number(query.status);
    }

    const [list, total] = await this.model.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { price: 'ASC' },
    });
    return pageResult(list, total, page, pageSize);
  }

  async detail(id: number): Promise<RoomEntity> {
    return this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<RoomEntity> });
  }

  async create(data: Partial<RoomEntity>): Promise<RoomEntity> {
    const entity = this.model.create(data);
    return this.model.save(entity);
  }

  async update(id: number, data: Partial<RoomEntity>): Promise<RoomEntity> {
    await this.model.update(id, data as any);
    return this.detail(id);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('房型不存在或已删除');
    }
  }
}
