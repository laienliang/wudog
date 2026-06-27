import { Repository } from 'typeorm';
import { ProductReview } from '../entity/product-review.entity';
import { Product } from '../entity/product.entity';

export class ProductReviewService {
  constructor(
    private repo: Repository<ProductReview>,
    private productRepo: Repository<Product>,
  ) {}

  async list(query: { productId?: number; page?: number; pageSize?: number }) {
    const { productId, page = 1, pageSize = 20 } = query;
    const where: any = { isDeleted: 0 };
    if (productId) where.productId = Number(productId);
    const [list, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async listAll(query: { productId?: number; rating?: number; page?: number; pageSize?: number }) {
    const { productId, rating, page = 1, pageSize = 20 } = query;
    const where: any = { isDeleted: 0 };
    if (productId) where.productId = Number(productId);
    if (rating) where.rating = Number(rating);
    const [list, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async create(userId: number, data: { product_id: number; order_id?: number; rating: number; content?: string; images?: string[]; is_anonymous?: number }) {
    const review = this.repo.create({
      userId,
      productId: data.product_id,
      orderId: data.order_id || undefined,
      rating: data.rating,
      content: data.content || '',
      images: data.images || [],
      isAnonymous: data.is_anonymous || 0,
    });
    const saved = await this.repo.save(review);
    await this.updateRatingStats(data.product_id);
    return saved;
  }

  async reply(id: number, reply: string) {
    const review = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!review) throw new Error('评价不存在');
    review.merchantReply = reply;
    return this.repo.save(review);
  }

  async delete(id: number) {
    const review = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!review) throw new Error('评价不存在');
    review.isDeleted = 1;
    await this.repo.save(review);
    await this.updateRatingStats(review.productId);
  }

  async updateRatingStats(productId: number) {
    const result = await this.repo
      .createQueryBuilder('r')
      .select('COUNT(r.id)', 'count')
      .addSelect('AVG(r.rating)', 'avg')
      .where('r.product_id = :productId AND r.is_deleted = 0', { productId })
      .getRawOne();
    await this.productRepo.update(productId, {
      reviewCount: Number(result.count) || 0,
      avgRating: result.avg ? Math.round(Number(result.avg) * 10) / 10 : null,
    });
  }
}
