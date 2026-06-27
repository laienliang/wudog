import { Repository } from 'typeorm';
import { RestaurantReview, ReviewTargetType } from '../entity/restaurant-review.entity';
import { Restaurant } from '../entity/restaurant.entity';
import { FarmProduct } from '../entity/farm-product.entity';

export class RestaurantReviewService {
  constructor(
    private repo: Repository<RestaurantReview>,
    private restaurantRepo: Repository<Restaurant>,
    private farmProductRepo: Repository<FarmProduct>,
  ) {}

  async list(targetType: string, targetId: number, query?: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query || {};
    const [list, total] = await this.repo.findAndCount({
      where: { targetType: targetType as ReviewTargetType, targetId, isDeleted: 0 },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async listAll(query: { page?: number; pageSize?: number; target_type?: string; target_id?: number }) {
    const { page = 1, pageSize = 20, target_type, target_id } = query;
    const where: any = { isDeleted: 0 };
    if (target_type) where.targetType = target_type;
    if (target_id) where.targetId = Number(target_id);

    const [list, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async create(userId: number, data: {
    target_type: string; target_id: number; rating: number;
    content?: string; images?: string[]; order_id?: number;
  }) {
    const review = this.repo.create({
      targetType: data.target_type as ReviewTargetType,
      targetId: data.target_id,
      userId,
      rating: data.rating,
      content: data.content || undefined,
      images: data.images || undefined,
      orderId: data.order_id || undefined,
    });
    const saved = await this.repo.save(review);
    await this.updateRatingStats(data.target_type, data.target_id);
    return saved;
  }

  async reply(id: number, merchantReply: string) {
    const review = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!review) throw new Error('评价不存在');
    review.merchantReply = merchantReply;
    return this.repo.save(review);
  }

  async delete(id: number) {
    const review = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!review) throw new Error('评价不存在');
    review.isDeleted = 1;
    const saved = await this.repo.save(review);
    await this.updateRatingStats(review.targetType, review.targetId);
    return saved;
  }

  async updateRatingStats(targetType: string, targetId: number) {
    const result = await this.repo
      .createQueryBuilder('r')
      .select('COUNT(r.id)', 'count')
      .addSelect('AVG(r.rating)', 'avg')
      .where('r.targetType = :targetType', { targetType })
      .andWhere('r.targetId = :targetId', { targetId })
      .andWhere('r.isDeleted = 0')
      .getRawOne();

    const count = Number(result?.count) || 0;
    const avg = count > 0 ? Number(Number(result?.avg).toFixed(1)) : null;

    if (targetType === ReviewTargetType.RESTAURANT) {
      await this.restaurantRepo.update(targetId, { avgRating: avg ?? undefined });
    } else if (targetType === ReviewTargetType.FARM_PRODUCT) {
      await this.farmProductRepo.update(targetId, { avgRating: avg ?? undefined, reviewCount: count });
    }
  }
}
