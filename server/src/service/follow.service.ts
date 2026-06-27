import { Repository } from 'typeorm';
import { Follow } from '../entity/follow.entity';

export class FollowService {
  constructor(private repo: Repository<Follow>) {}

  async toggle(followerId: number, followedId: number) {
    if (followerId === followedId) throw new Error('不能关注自己');
    const existing = await this.repo.findOne({ where: { followerId, followedId } });
    if (existing) {
      await this.repo.remove(existing);
      return { followed: false };
    }
    await this.repo.save({ followerId, followedId });
    return { followed: true };
  }

  async list(query: { userId?: number; type?: string; page?: number; pageSize?: number }) {
    const { userId, type = 'following', page = 1, pageSize = 20 } = query;
    const where: any = {};
    if (type === 'following') {
      where.followerId = Number(userId);
    } else {
      where.followedId = Number(userId);
    }
    const [list, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    if (!followerId) return false;
    const row = await this.repo.findOne({ where: { followerId, followedId } });
    return !!row;
  }
}
