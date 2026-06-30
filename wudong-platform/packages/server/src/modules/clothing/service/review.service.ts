import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Review } from '../entity/review.entity';

@Provide()
export class ReviewService {
  @InjectEntityModel(Review)
  reviewModel: Repository<Review>;

  /**
   * 评价列表（含商品&用户关联信息）
   */
  async paginate(query: any) {
    const {
      page = 1, pageSize = 10,
      keyword, rating, status, productId,
    } = query;

    let sql = `
      SELECT r.*,
        p.name AS product_name, p.main_image AS product_image,
        u.nickname AS user_name, u.avatar AS user_avatar
      FROM wd_clothing_review r
      LEFT JOIN wd_clothing_product p ON r.product_id = p.id
      LEFT JOIN wd_user u ON r.user_id = u.id
      WHERE r.deleted_at IS NULL
    `;
    const params: any[] = [];

    if (keyword) {
      sql += ' AND (p.name LIKE ? OR CAST(r.product_id AS CHAR) LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (rating) {
      sql += ' AND r.rating = ?';
      params.push(Number(rating));
    }
    if (status) {
      sql += ' AND r.status = ?';
      params.push(status);
    }
    if (productId) {
      sql += ' AND r.product_id = ?';
      params.push(Number(productId));
    }

    sql += ' ORDER BY r.created_at DESC';

    // 计数（提取 FROM 之后的部分）
    const fromIdx = sql.indexOf('FROM');
    const countSql = 'SELECT COUNT(*) AS total ' + sql.slice(fromIdx);
    const countResult = await this.reviewModel.query(countSql, params);
    const total = Number(countResult[0]?.total || 0);

    // 分页
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${Number(pageSize)} OFFSET ${Number(offset)}`;
    const list = await this.reviewModel.query(sql, params);

    return {
      list,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  /** 更新评价状态 */
  async updateStatus(id: number, status: string) {
    await this.reviewModel.update(id, { status });
    return this.reviewModel.findOne({ where: { id } });
  }

  /** 批量更新状态 */
  async batchUpdateStatus(ids: number[], status: string) {
    await this.reviewModel.update(ids, { status } as any);
    return { success: true, count: ids.length };
  }

  /** 商家回复 */
  async reply(id: number, reply: string) {
    await this.reviewModel.update(id, { reply });
    return this.reviewModel.findOne({ where: { id } });
  }

  /** 删除评价 */
  async softDelete(id: number) {
    return this.reviewModel.softDelete(id);
  }

  /** 批量删除 */
  async batchDelete(ids: number[]) {
    await this.reviewModel.update(ids, { deletedAt: new Date() } as any);
    return { success: true, count: ids.length };
  }
}
