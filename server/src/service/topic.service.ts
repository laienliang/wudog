import { Repository } from 'typeorm';
import { Topic } from '../entity/topic.entity';

export class TopicService {
  constructor(private repo: Repository<Topic>) {}

  async list(query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = query;
    const [list, total] = await this.repo.findAndCount({
      where: { isDeleted: 0 },
      order: { isPinned: 'DESC', noteCount: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async detail(id: number) {
    return this.repo.findOne({ where: { id, isDeleted: 0 } });
  }

  async create(data: { name: string; description?: string; cover_image?: string }) {
    const topic = this.repo.create({
      name: data.name,
      description: data.description || '',
      coverImage: data.cover_image || '',
    });
    return this.repo.save(topic);
  }

  async update(id: number, data: { name?: string; description?: string; cover_image?: string; is_pinned?: number; is_recommended?: number }) {
    const topic = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!topic) throw new Error('话题不存在');
    if (data.name !== undefined) topic.name = data.name;
    if (data.description !== undefined) topic.description = data.description;
    if (data.cover_image !== undefined) topic.coverImage = data.cover_image;
    if (data.is_pinned !== undefined) topic.isPinned = data.is_pinned;
    if (data.is_recommended !== undefined) topic.isRecommended = data.is_recommended;
    return this.repo.save(topic);
  }

  async delete(id: number) {
    const topic = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!topic) throw new Error('话题不存在');
    topic.isDeleted = 1;
    return this.repo.save(topic);
  }

  async getAll() {
    return this.repo.find({ where: { isDeleted: 0 }, order: { isPinned: 'DESC', noteCount: 'DESC' } });
  }
}
