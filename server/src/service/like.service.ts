import { Repository } from 'typeorm';
import { Like } from '../entity/like.entity';
import { TravelNote } from '../entity/travel-note.entity';
import { Comment } from '../entity/comment.entity';

export class LikeService {
  constructor(
    private repo: Repository<Like>,
    private noteRepo: Repository<TravelNote>,
    private commentRepo: Repository<Comment>,
  ) {}

  async toggle(userId: number, targetType: string, targetId: number) {
    const existing = await this.repo.findOne({ where: { userId, targetType, targetId } });
    if (existing) {
      await this.repo.remove(existing);
      if (targetType === 'note') {
        await this.noteRepo.decrement({ id: targetId }, 'likeCount', 1);
      } else if (targetType === 'comment') {
        await this.commentRepo.decrement({ id: targetId }, 'likeCount', 1);
      }
      return { liked: false };
    }
    await this.repo.save({ userId, targetType, targetId });
    if (targetType === 'note') {
      await this.noteRepo.increment({ id: targetId }, 'likeCount', 1);
    } else if (targetType === 'comment') {
      await this.commentRepo.increment({ id: targetId }, 'likeCount', 1);
    }
    return { liked: true };
  }

  async list(query: { targetType?: string; targetId?: number; page?: number; pageSize?: number }) {
    const { targetType, targetId, page = 1, pageSize = 20 } = query;
    const where: any = {};
    if (targetType) where.targetType = targetType;
    if (targetId) where.targetId = Number(targetId);
    const [list, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async isLiked(userId: number, targetType: string, targetId: number): Promise<boolean> {
    if (!userId) return false;
    const row = await this.repo.findOne({ where: { userId, targetType, targetId } });
    return !!row;
  }
}
