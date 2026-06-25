import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { MiaoVillageEntity } from '../entity/miao-village.entity';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';

@Provide()
@Scope(ScopeEnum.Singleton)
export class MiaoVillageService {
  @InjectEntityModel(MiaoVillageEntity)
  model: Repository<MiaoVillageEntity>;

  async list(query: IPageQuery): Promise<IPageResult<MiaoVillageEntity>> {
    const { page, pageSize } = parsePage(query);
    const where: FindOptionsWhere<MiaoVillageEntity> = { isDeleted: 0 };

    if (query.keyword) {
      where.name = Like(`%${query.keyword}%`);
    }
    if (query.status !== undefined && query.status !== '') {
      where.status = Number(query.status);
    }

    const [list, total] = await this.model.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return pageResult(list, total, page, pageSize);
  }

  async detail(id: number): Promise<MiaoVillageEntity> {
    return this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<MiaoVillageEntity> });
  }

  async create(data: Partial<MiaoVillageEntity>): Promise<MiaoVillageEntity> {
    const entity = this.model.create(data);
    return this.model.save(entity);
  }

  async update(id: number, data: Partial<MiaoVillageEntity>): Promise<MiaoVillageEntity> {
    await this.model.update(id, data as any);
    return this.detail(id);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('苗寨不存在或已删除');
    }
  }
}
