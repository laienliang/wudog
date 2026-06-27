import { Repository } from 'typeorm';
import { HomestayReview } from '../entity/homestay-review.entity';
import { Homestay } from '../entity/homestay.entity';

export class HomestayReviewService {
  constructor(
    private repo: Repository<HomestayReview>,
    private homestayRepo: Repository<Homestay>,
  ) {}

  async list(query: { homestay_id: number; page?: number; pageSize?: number }) {
    const { homestay_id, page = 1, pageSize = 10 } = query;
    const [list, total] = await this.repo.findAndCount({
      where: { homestayId: homestay_id, isDeleted: 0 },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async listAll(query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query;
    const [list, total] = await this.repo.findAndCount({
      where: { isDeleted: 0 },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize, take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async create(userId: number, data: {
    homestay_id: number; order_id?: number; rating: number; content?: string; images?: string[];
  }) {
    const review = this.repo.create({
      userId,
      homestayId: data.homestay_id,
      orderId: data.order_id || undefined,
      rating: data.rating,
      content: data.content || undefined,
      images: data.images || undefined,
    });
    const saved = await this.repo.save(review);
    await this.updateRatingStats(data.homestay_id);
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
    await this.repo.save(review);
    await this.updateRatingStats(review.homestayId);
  }

  private async updateRatingStats(homestayId: number) {
    const stats = await this.repo.createQueryBuilder('r')
      .select('COUNT(r.id)', 'count')
      .addSelect('AVG(r.rating)', 'avg')
      .where('r.homestayId = :homestayId AND r.isDeleted = 0', { homestayId })
      .getRawOne();
    await this.homestayRepo.update(homestayId, {
      avgRating: stats?.avg != null ? Math.round(Number(stats.avg) * 10) / 10 : null,
    });
  }
}
