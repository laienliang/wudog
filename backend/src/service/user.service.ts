import { Provide, Scope, ScopeEnum, Init } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';

@Provide()
@Scope(ScopeEnum.Singleton)
export class UserService {
  @InjectEntityModel(UserEntity)
  model: Repository<UserEntity>;

  /**
   * 用户列表（分页 + 关键词搜索）
   */
  async list(query: IPageQuery): Promise<IPageResult<UserEntity>> {
    const { page, pageSize } = parsePage(query);
    const where: FindOptionsWhere<UserEntity> = { isDeleted: 0 };

    if (query.keyword) {
      where.username = Like(`%${query.keyword}%`);
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

  async detail(id: number): Promise<UserEntity> {
    return this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<UserEntity> });
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.model.create(data);
    return this.model.save(entity);
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.model.update(id, data as any);
    return this.detail(id);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('用户不存在或已删除');
    }
  }
}
