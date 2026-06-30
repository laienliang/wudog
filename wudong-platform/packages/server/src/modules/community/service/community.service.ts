import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Travelogue } from '../entity/travelogue.entity';
import { Comment } from '../entity/comment.entity';
import { Like } from '../entity/like.entity';
import { Topic } from '../entity/topic.entity';
import { Follow } from '../entity/follow.entity';
import { Favorite } from '../entity/favorite.entity';
import { Report } from '../entity/report.entity';

@Provide()
export class CommunityService {
  @InjectEntityModel(Travelogue) travelogueModel: Repository<Travelogue>;
  @InjectEntityModel(Comment) commentModel: Repository<Comment>;
  @InjectEntityModel(Like) likeModel: Repository<Like>;
  @InjectEntityModel(Topic) topicModel: Repository<Topic>;
  @InjectEntityModel(Follow) followModel: Repository<Follow>;
  @InjectEntityModel(Favorite) favoriteModel: Repository<Favorite>;
  @InjectEntityModel(Report) reportModel: Repository<Report>;

  // ===== 游记 =====
  async listTravelogues(query: any) {
    const { page = 1, pageSize = 10, status, keyword } = query;
    const qb = this.travelogueModel.createQueryBuilder('t')
      .where('t.deletedAt IS NULL')
      .orderBy('t.createdAt', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);
    if (status !== undefined) qb.andWhere('t.status = :st', { st: Number(status) });
    if (keyword) qb.andWhere('t.title LIKE :kw', { kw: `%${keyword}%` });
    const [list, total] = await qb.getManyAndCount();
    // 关联用户信息
    const enriched = await Promise.all(list.map(async (t: any) => {
      const user = await this.travelogueModel.query('SELECT nickname, avatar FROM wd_user WHERE id = ?', [t.userId]);
      return { ...t, user_name: user[0]?.nickname || '匿名', user_avatar: user[0]?.avatar || null };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getTravelogue(id: number) {
    const t = await this.travelogueModel.findOne({ where: { id } });
    if (!t) throw new Error('游记不存在');
    // 增加浏览数
    await this.travelogueModel.update(id, { viewCount: (t.viewCount || 0) + 1 });
    const user = await this.travelogueModel.query('SELECT nickname, avatar FROM wd_user WHERE id = ?', [t.userId]);
    const rawComments = await this.commentModel.find({ where: { targetType: 'travelogue', targetId: id, deletedAt: undefined }, order: { createdAt: 'DESC' }, take: 10 });
    const comments = await Promise.all(rawComments.map(async (c: any) => {
      const cu = await this.commentModel.query('SELECT nickname FROM wd_user WHERE id = ?', [c.userId]);
      return { ...c, user_name: cu[0]?.nickname || '用户' };
    }));
    return { ...t, user_name: user[0]?.nickname || '用户', user_avatar: user[0]?.avatar || null, comments };
  }

  async createTravelogue(data: any) { return this.travelogueModel.save(data); }
  async updateTravelogue(id: number, data: any) { await this.travelogueModel.update(id, data); return this.travelogueModel.findOne({ where: { id } }); }
  async updateStatus(id: number, status: number) { await this.travelogueModel.update(id, { status }); return this.travelogueModel.findOne({ where: { id } }); }
  async deleteTravelogue(id: number) { return this.travelogueModel.softDelete(id); }

  // ===== 评论 =====
  async listComments(query: any) {
    const { page = 1, pageSize = 10, targetType, targetId } = query;
    const qb = this.commentModel.createQueryBuilder('c').where('c.deletedAt IS NULL').orderBy('c.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    if (targetType) qb.andWhere('c.targetType = :tt', { tt: targetType });
    if (targetId) qb.andWhere('c.targetId = :ti', { ti: Number(targetId) });
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(list.map(async (c: any) => {
      const user = await this.commentModel.query('SELECT nickname FROM wd_user WHERE id = ?', [c.userId]);
      return { ...c, user_name: user[0]?.nickname || '匿名' };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async createComment(data: any) {
    const c = await this.commentModel.save(data);
    if (data.targetType === 'travelogue') {
      await this.travelogueModel.increment({ id: data.targetId }, 'commentCount', 1);
    }
    return c;
  }

  async deleteComment(id: number) { return this.commentModel.softDelete(id); }

  async replyComment(commentId: number, content: string) {
    const comment = await this.commentModel.findOne({ where: { id: commentId } });
    if (!comment) throw new Error('评论不存在');
    await this.commentModel.update(commentId, { reply: content } as any);
    return { success: true };
  }

  // ===== 点赞 =====
  async toggleLike(userId: number, targetType: string, targetId: number) {
    const existing = await this.likeModel.findOne({ where: { userId, targetType, targetId } });
    if (existing) {
      await this.likeModel.delete(existing.id);
      if (targetType === 'travelogue') await this.travelogueModel.decrement({ id: targetId }, 'likeCount', 1);
      return { liked: false };
    }
    await this.likeModel.save({ userId, targetType, targetId });
    if (targetType === 'travelogue') await this.travelogueModel.increment({ id: targetId }, 'likeCount', 1);
    return { liked: true };
  }

  // ===== 话题 =====
  async listTopics() { return this.topicModel.find({ where: { deletedAt: undefined }, order: { sortOrder: 'ASC' } }); }
  async createTopic(data: any) { return this.topicModel.save(data); }
  async updateTopic(id: number, data: any) { await this.topicModel.update(id, data); return this.topicModel.findOne({ where: { id } }); }
  async deleteTopic(id: number) { return this.topicModel.softDelete(id); }

  // ===== 关注 =====
  async toggleFollow(followerId: number, followingId: number) {
    const existing = await this.followModel.findOne({ where: { followerId, followingId } });
    if (existing) { await this.followModel.delete(existing.id); return { following: false }; }
    await this.followModel.save({ followerId, followingId });
    return { following: true };
  }

  // ===== 收藏 =====
  async toggleFavorite(userId: number, targetType: string, targetId: number) {
    const existing = await this.favoriteModel.findOne({ where: { userId, targetType, targetId } });
    if (existing) { await this.favoriteModel.delete(existing.id); return { favorited: false }; }
    await this.favoriteModel.save({ userId, targetType, targetId });
    return { favorited: true };
  }

  async listFavorites(userId: number, targetType?: string) {
    const where: any = { userId };
    if (targetType) where.targetType = targetType;
    return this.favoriteModel.find({ where, order: { createdAt: 'DESC' } });
  }

  // ===== 举报 =====
  async listReports(query: any) {
    const { page = 1, pageSize = 10, status } = query;
    const qb = this.reportModel.createQueryBuilder('r').where('r.deletedAt IS NULL').orderBy('r.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    if (status !== undefined) qb.andWhere('r.status = :st', { st: Number(status) });
    const [list, total] = await qb.getManyAndCount();
    const enriched = await Promise.all(list.map(async (r: any) => {
      const user = await this.reportModel.query('SELECT nickname FROM wd_user WHERE id = ?', [r.userId]);
      return { ...r, user_name: user[0]?.nickname || '匿名' };
    }));
    return { list: enriched, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async updateReportStatus(id: number, status: number) { await this.reportModel.update(id, { status }); return this.reportModel.findOne({ where: { id } }); }

  // ===== 数据统计 =====
  async getStats() {
    const totalTravelogues = await this.travelogueModel.count({ where: { deletedAt: undefined } });
    const totalComments = await this.commentModel.count({ where: { deletedAt: undefined } });
    const topics = await this.topicModel.find({ where: { deletedAt: undefined }, order: { sortOrder: 'ASC' }, take: 10 });
    return { totalTravelogues, todayCount: 0, totalComments, totalLikes: 0, topicCount: topics.length, topTopics: topics.map(t => t.name) };
  }
}
