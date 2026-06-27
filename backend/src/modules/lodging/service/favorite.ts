// ============================================================
// 民宿收藏 Service — 添加/取消 + 列表
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\favorite.ts
// ============================================================
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entity/favorite';
import { Homestay } from '../entity/homestay';
import { PaginatedResult } from '../../../interface';

@Provide()
export class FavoriteService {
  @InjectEntityModel(Favorite)
  favoriteRepo: Repository<Favorite>;

  @InjectEntityModel(Homestay)
  homestayRepo: Repository<Homestay>;

  /** 收藏/取消收藏 toggle */
  async toggle(userId: number, homestayId: number): Promise<{ isFavorited: boolean }> {
    // 校验民宿存在
    const homestay = await this.homestayRepo.findOneBy({ id: homestayId, is_deleted: 0 }) as Homestay;
    if (!homestay) throw new Error('民宿不存在');

    const existing = await this.favoriteRepo.findOneBy({
      user_id: userId,
      homestay_id: homestayId,
      is_deleted: 0,
    }) as Favorite;

    if (existing) {
      // 取消收藏（软删除）
      await this.favoriteRepo.update(existing.id, { is_deleted: 1 } as any);
      return { isFavorited: false };
    }

    // 添加收藏
    const entity = this.favoriteRepo.create({ user_id: userId, homestay_id: homestayId });
    await this.favoriteRepo.save(entity);
    return { isFavorited: true };
  }

  /** 用户收藏列表 */
  async list(
    userId: number,
    query: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<Homestay>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    const qb = this.favoriteRepo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.homestay', 'h')  // 注意：Favorite 实体无直接关联，需用 homestayRepo
      .where('f.user_id = :uid', { uid: userId })
      .andWhere('f.is_deleted = 0')
      .orderBy('f.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [favs, total] = await qb.getManyAndCount();

    // 手动加载民宿信息
    const homestayIds = favs.map(f => f.homestay_id);
    const homestays = homestayIds.length > 0
      ? await this.homestayRepo.find({
          where: homestayIds.map(id => ({ id, is_deleted: 0 })),
        })
      : [];

    const homestayMap = new Map(homestays.map(h => [h.id, h]));
    const list = favs.map(f => homestayMap.get(f.homestay_id)).filter(Boolean) as Homestay[];

    return { total, page, pageSize, list };
  }

  /** 检查是否已收藏 */
  async isFavorited(userId: number, homestayId: number): Promise<boolean> {
    const fav = await this.favoriteRepo.findOneBy({
      user_id: userId,
      homestay_id: homestayId,
      is_deleted: 0,
    }) as Favorite;
    return !!fav;
  }
}
