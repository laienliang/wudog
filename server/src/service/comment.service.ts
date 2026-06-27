import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entity/comment.entity';

export class CommentService {
  constructor(private repo: Repository<Comment>) {}

  async list(query: { noteId?: number; page?: number; pageSize?: number }) {
    const { noteId, page = 1, pageSize = 20 } = query;
    const where: any = { isDeleted: 0, parentId: IsNull() };
    if (noteId) where.noteId = Number(noteId);

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const result = [];
    for (const item of list) {
      const replies = await this.repo.find({
        where: { parentId: item.id, isDeleted: 0 },
        order: { createdAt: 'ASC' },
        take: 3,
      });
      result.push({ ...item, replies });
    }
    return { list: result, total, page, pageSize };
  }

  async create(userId: number, data: { note_id: number; parent_id?: number; content: string }) {
    const comment = this.repo.create({
      userId,
      noteId: data.note_id,
      parentId: data.parent_id || undefined,
      content: data.content,
    });
    return this.repo.save(comment);
  }

  async delete(userId: number, id: number, isAdmin = false) {
    const comment = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!comment) throw new Error('评论不存在');
    if (!isAdmin && comment.userId !== userId) throw new Error('无权删除他人的评论');
    comment.isDeleted = 1;
    return this.repo.save(comment);
  }
}
