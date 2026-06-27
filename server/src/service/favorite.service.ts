import { Repository } from 'typeorm';
import { Favorite } from '../entity/favorite.entity';
import { TravelNote } from '../entity/travel-note.entity';

export class FavoriteService {
  constructor(
    private repo: Repository<Favorite>,
    private noteRepo: Repository<TravelNote>,
  ) {}

  async toggle(userId: number, noteId: number) {
    const existing = await this.repo.findOne({ where: { userId, noteId } });
    if (existing) {
      await this.repo.remove(existing);
      await this.noteRepo.decrement({ id: noteId }, 'favoriteCount', 1);
      return { favorited: false };
    }
    await this.repo.save({ userId, noteId });
    await this.noteRepo.increment({ id: noteId }, 'favoriteCount', 1);
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

  async isFavorited(userId: number, noteId: number): Promise<boolean> {
    if (!userId) return false;
    const row = await this.repo.findOne({ where: { userId, noteId } });
    return !!row;
  }
}
