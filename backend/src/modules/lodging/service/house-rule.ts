// ============================================================
// 入住须知 Service
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\house-rule.ts
// ============================================================
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HouseRule } from '../entity/house-rule';
import { PaginatedResult } from '../../../interface';

@Provide()
export class HouseRuleService {
  @InjectEntityModel(HouseRule)
  ruleRepo: Repository<HouseRule>;

  /** 获取某民宿的入住须知 */
  async getByHomestay(homestayId: number): Promise<HouseRule | null> {
    return await this.ruleRepo.findOneBy({ homestay_id: homestayId, is_deleted: 0 }) as HouseRule;
  }

  /** 分页列表 */
  async list(query: { page?: number; pageSize?: number }): Promise<PaginatedResult<HouseRule>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const [list, total] = await this.ruleRepo.findAndCount({
      where: { is_deleted: 0 },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'ASC' },
    });
    return { total, page, pageSize, list };
  }

  /** 新增/更新（upsert：每个民宿仅一条） */
  async save(data: Partial<HouseRule>): Promise<HouseRule> {
    const existing = await this.ruleRepo.findOneBy({
      homestay_id: data.homestay_id,
      is_deleted: 0,
    }) as HouseRule;

    if (existing) {
      await this.ruleRepo.update(existing.id, data);
      return await this.ruleRepo.findOneBy({ id: existing.id }) as HouseRule;
    }

    const entity = this.ruleRepo.create(data);
    return this.ruleRepo.save(entity);
  }

  /** 软删除 */
  async softDelete(id: number): Promise<void> {
    await this.ruleRepo.update(id, { is_deleted: 1 } as any);
  }
}
