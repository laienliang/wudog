// ============================================================
// 住宿评价 Service — CRUD + 房东回复
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\review.ts
// ============================================================
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entity/review';
import { HomestayService } from './homestay';
import { PaginatedResult } from '../../../interface';

@Provide()
export class ReviewService {
  @InjectEntityModel(Review)
  reviewRepo: Repository<Review>;

  @Inject()
  homestayService: HomestayService;

  /** 按民宿查询评价列表 */
  async list(query: {
    page?: number;
    pageSize?: number;
    homestay_id?: number;
  }): Promise<PaginatedResult<Review>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const qb = this.reviewRepo
      .createQueryBuilder('r')
      .where('r.is_deleted = 0')
      .andWhere('r.status = 1');

    if (query.homestay_id) {
      qb.andWhere('r.homestay_id = :hid', { hid: query.homestay_id });
    }

    qb.orderBy('r.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { total, page, pageSize, list };
  }

  /** 创建评价 */
  async create(data: {
    order_id: number;
    rating: number;
    content?: string;
    images?: string[];
    user_id: number;
    homestay_id: number;
  }): Promise<Review> {
    // 检查是否已评价
    const existing = await this.reviewRepo.findOneBy({
      order_id: data.order_id,
      is_deleted: 0,
    }) as Review;
    if (existing) throw new Error('该订单已评价');

    const entity = this.reviewRepo.create({
      order_id: data.order_id,
      user_id: data.user_id,
      homestay_id: data.homestay_id,
      rating: data.rating,
      content: data.content || '',
      images: data.images || [],
    });

    const saved = await this.reviewRepo.save(entity);

    // 更新民宿评分
    await this.homestayService.updateRating(data.homestay_id);

    return saved;
  }

  /** 房东回复 */
  async reply(id: number, ownerReply: string): Promise<Review> {
    const review = await this.reviewRepo.findOneBy({ id, is_deleted: 0 }) as Review;
    if (!review) throw new Error('评价不存在');
    // 回复内容写入content字段末尾
    review.content = review.content
      ? `${review.content}\n\n【房东回复】${ownerReply}`
      : `【房东回复】${ownerReply}`;
    return this.reviewRepo.save(review);
  }

  /** 软删除（或隐藏） */
  async softDelete(id: number): Promise<void> {
    const review = await this.reviewRepo.findOneBy({ id }) as Review;
    await this.reviewRepo.update(id, { is_deleted: 1 } as any);
    if (review) {
      await this.homestayService.updateRating(review.homestay_id);
    }
  }

  /** 切换显示/隐藏 */
  async toggleStatus(id: number, status: number): Promise<void> {
    await this.reviewRepo.update(id, { status } as any);
  }
}
