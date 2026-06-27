import { Repository } from 'typeorm';
import { ProductFavorite } from '../entity/product-favorite.entity';

export class ProductFavoriteService {
  constructor(private repo: Repository<ProductFavorite>) {}

  async toggle(userId: number, productId: number) {
    const existing = await this.repo.findOne({ where: { userId, productId } });
    if (existing) {
      await this.repo.remove(existing);
      return { favorited: false };
    }
    await this.repo.save({ userId, productId });
    return { favorited: true };
  }

  async list(userId: number, query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query;
    const [list, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async isFavorited(userId: number, productId: number): Promise<boolean> {
    if (!userId) return false;
    const row = await this.repo.findOne({ where: { userId, productId } });
    return !!row;
  }
}
