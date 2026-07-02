import { Repository, Like, In } from 'typeorm';
import { TravelNote } from '../entity/travel-note.entity';

export class TravelNoteService {
  constructor(private repo: Repository<TravelNote>) {}

  async list(query: { page?: number; pageSize?: number; topic?: number; status?: string; keyword?: string; sort?: string; userId?: number }) {
    const { page = 1, pageSize = 20, topic, status, keyword, sort, userId } = query;
    const where: any = { isDeleted: 0 };
    if (topic) where.topicId = Number(topic);
    if (status) where.status = status;
    if (keyword) where.title = Like(`%${keyword}%`);
    if (userId) where.userId = userId;

    const order: any = { createdAt: 'DESC' };
    if (sort === 'popular') order.likeCount = 'DESC';
    if (sort === 'views') order.viewCount = 'DESC';

    const [list, total] = await this.repo.findAndCount({
      where,
      order,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async detail(id: number) {
    const note = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!note) throw new Error('游记不存在');
    await this.repo.increment({ id }, 'viewCount', 1);
    note.viewCount += 1;
    return note;
  }

  async create(userId: number, data: { title: string; content: string; images?: string[]; video_url?: string; location?: string; topic_id?: number }) {
    const note = this.repo.create({
      userId,
      title: data.title,
      content: data.content,
      images: data.images || [],
      videoUrl: data.video_url || undefined,
      location: data.location || undefined,
      topicId: data.topic_id || undefined,
      status: 'draft',
    });
    return this.repo.save(note);
  }

  async update(userId: number, id: number, data: { title?: string; content?: string; images?: string[]; video_url?: string; location?: string; topic_id?: number }) {
    const note = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!note) throw new Error('游记不存在');
    if (note.userId !== userId) throw new Error('无权编辑他人的游记');
    if (!['draft', 'rejected'].includes(note.status)) throw new Error('只能编辑草稿或已驳回的游记');
    if (data.title !== undefined) note.title = data.title;
    if (data.content !== undefined) note.content = data.content;
    if (data.images !== undefined) note.images = data.images;
    if (data.video_url !== undefined) note.videoUrl = data.video_url;
    if (data.location !== undefined) note.location = data.location;
    if (data.topic_id !== undefined) note.topicId = data.topic_id;
    note.status = 'draft';
    return this.repo.save(note);
  }

  async delete(userId: number, id: number, isAdmin = false) {
    const note = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!note) throw new Error('游记不存在');
    if (!isAdmin && note.userId !== userId) throw new Error('无权删除他人的游记');
    note.isDeleted = 1;
    return this.repo.save(note);
  }

  async remove(id: number) {
    const note = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!note) throw new Error('游记不存在');
    note.status = 'removed';
    return this.repo.save(note);
  }

  async submitReview(userId: number, id: number) {
    const note = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!note) throw new Error('游记不存在');
    if (note.userId !== userId) throw new Error('无权操作');
    if (!['draft', 'rejected'].includes(note.status)) throw new Error('当前状态不可提交审核');
    if (!note.title || !note.content) throw new Error('标题和正文不能为空');
    note.status = 'reviewing';
    return this.repo.save(note);
  }

  async review(id: number, data: { action: string; reject_reason?: string }) {
    const note = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!note) throw new Error('游记不存在');
    if (note.status !== 'reviewing') throw new Error('只有待审核的游记才能审核');
    if (data.action === 'approve') {
      note.status = 'published';
      note.rejectReason = '';
    } else if (data.action === 'reject') {
      if (!data.reject_reason) throw new Error('驳回必须填写原因');
      note.status = 'rejected';
      note.rejectReason = data.reject_reason;
    } else {
      throw new Error('无效的操作');
    }
    return this.repo.save(note);
  }

  async getByIds(ids: number[]) {
    if (!ids.length) return [];
    return this.repo.find({ where: { id: In(ids), isDeleted: 0 } });
  }
}
