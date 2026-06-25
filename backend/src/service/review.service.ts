import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ReviewEntity } from '../entity/review.entity';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ReviewService {
  @InjectEntityModel(ReviewEntity)
  model: Repository<ReviewEntity>;

  /**
   * 评价列表（分页）
   * 支持按 accommodationId / userId / rating 筛选
   */
  async list(query: IPageQuery): Promise<IPageResult<ReviewEntity>> {
    const { page, pageSize } = parsePage(query);
    const where: FindOptionsWhere<ReviewEntity> = { isDeleted: 0 };

    if (query.accommodationId) {
      where.accommodationId = Number(query.accommodationId);
    }
    if (query.userId) {
      where.userId = Number(query.userId);
    }
    if (query.rating !== undefined && query.rating !== '') {
      where.rating = Number(query.rating);
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

  async detail(id: number): Promise<ReviewEntity> {
    return this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<ReviewEntity> });
  }

  async create(data: Partial<ReviewEntity>): Promise<ReviewEntity> {
    const entity = this.model.create(data);
    return this.model.save(entity);
  }

  async update(id: number, data: Partial<ReviewEntity>): Promise<ReviewEntity> {
    await this.model.update(id, data as any);
    return this.detail(id);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('评价不存在或已删除');
    }
  }
}
