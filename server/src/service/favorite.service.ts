import { Repository, In } from 'typeorm';
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
    // 关联查询游记数据
    const noteIds = list.map(f => f.noteId);
    const notes = noteIds.length ? await this.noteRepo.find({
      where: { id: In(noteIds), isDeleted: 0 },
    }) : [];
    const noteMap: Record<number, any> = {};
    notes.forEach(n => { noteMap[n.id] = n; });
    const enriched = list.map(f => ({ ...f, note: noteMap[f.noteId] || null }));
    return { list: enriched, total, page, pageSize };
  }

  async isFavorited(userId: number, noteId: number): Promise<boolean> {
    if (!userId) return false;
    const row = await this.repo.findOne({ where: { userId, noteId } });
    return !!row;
  }
}
