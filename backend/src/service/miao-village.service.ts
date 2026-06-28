import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { MiaoVillageEntity } from '../entity/miao-village.entity';
import { IPageQuery, IPageResult } from '../interfaces';
import { parsePage, pageResult } from '../utils/response';
import { withCache, clearCacheByPrefix } from '../utils/redis';

// 缓存键前缀 & TTL
const CACHE_PREFIX = 'miao-village:list';
const CACHE_TTL = 300; // 5 分钟

@Provide()
@Scope(ScopeEnum.Singleton)
export class MiaoVillageService {
  @InjectEntityModel(MiaoVillageEntity)
  model: Repository<MiaoVillageEntity>;

  /**
   * 苗寨列表（Redis 缓存）
   * 缓存键: miao-village:list:{page}:{pageSize}:{keyword}:{status}
   */
  async list(query: IPageQuery): Promise<IPageResult<MiaoVillageEntity>> {
    const { page, pageSize } = parsePage(query);
    const keyword = query.keyword || '';
    const status = query.status !== undefined && query.status !== '' ? Number(query.status) : 'all';

    const cacheKey = `${CACHE_PREFIX}:${page}:${pageSize}:${keyword}:${status}`;

    return withCache(cacheKey, async () => {
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
    }, CACHE_TTL);
  }

  async detail(id: number): Promise<MiaoVillageEntity> {
    return this.model.findOne({ where: { id, isDeleted: 0 } as FindOptionsWhere<MiaoVillageEntity> });
  }

  /**
   * 新增苗寨后清除列表缓存
   */
  async create(data: Partial<MiaoVillageEntity>): Promise<MiaoVillageEntity> {
    const entity = this.model.create(data);
    const result = await this.model.save(entity);
    await clearCacheByPrefix(CACHE_PREFIX);
    return result;
  }

  /**
   * 更新苗寨后清除列表缓存
   */
  async update(id: number, data: Partial<MiaoVillageEntity>): Promise<MiaoVillageEntity> {
    await this.model.update(id, data as any);
    await clearCacheByPrefix(CACHE_PREFIX);
    return this.detail(id);
  }

  /**
   * 软删除苗寨后清除列表缓存
   */
  async softDelete(id: number): Promise<void> {
    const result = await this.model.update(id, { isDeleted: 1, updatedAt: new Date() } as any);
    if (!result.affected) {
      throw new Error('苗寨不存在或已删除');
    }
    await clearCacheByPrefix(CACHE_PREFIX);
  }
}
