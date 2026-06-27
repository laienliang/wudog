import { Repository } from 'typeorm';
import { Report } from '../entity/report.entity';
import { TravelNote } from '../entity/travel-note.entity';
import { Comment } from '../entity/comment.entity';

export class ReportService {
  constructor(
    private repo: Repository<Report>,
    private noteRepo: Repository<TravelNote>,
    private commentRepo: Repository<Comment>,
  ) {}

  async create(reporterId: number, data: { target_type: string; target_id: number; reason: string }) {
    const existing = await this.repo.findOne({
      where: { reporterId, targetType: data.target_type, targetId: data.target_id },
    });
    if (existing) throw new Error('您已举报过该内容');

    const report = this.repo.create({
      reporterId,
      targetType: data.target_type,
      targetId: data.target_id,
      reason: data.reason,
      status: 'pending',
    });
    await this.repo.save(report);

    // 增加目标举报计数，达到3次自动隐藏
    if (data.target_type === 'note') {
      await this.noteRepo.increment({ id: data.target_id }, 'reportCount', 1);
      const note = await this.noteRepo.findOne({ where: { id: data.target_id } });
      if (note && note.reportCount >= 3 && note.status === 'published') {
        note.status = 'reviewing';
        await this.noteRepo.save(note);
      }
    } else if (data.target_type === 'comment') {
      await this.commentRepo.increment({ id: data.target_id }, 'reportCount', 1);
    }

    return report;
  }

  async list(query: { targetType?: string; status?: string; page?: number; pageSize?: number }) {
    const { targetType, status, page = 1, pageSize = 20 } = query;
    const where: any = {};
    if (targetType) where.targetType = targetType;
    if (status) where.status = status;
    const [list, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async handle(id: number, data: { action: string; handle_result?: string }) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) throw new Error('举报不存在');
    if (report.status !== 'pending') throw new Error('该举报已处理');

    if (data.action === 'handle') {
      report.status = 'handled';
      // 删除被举报内容
      if (report.targetType === 'note') {
        const note = await this.noteRepo.findOne({ where: { id: report.targetId } });
        if (note) { note.isDeleted = 1; await this.noteRepo.save(note); }
      } else if (report.targetType === 'comment') {
        const comment = await this.commentRepo.findOne({ where: { id: report.targetId } });
        if (comment) { comment.isDeleted = 1; await this.commentRepo.save(comment); }
      }
    } else if (data.action === 'dismiss') {
      report.status = 'dismissed';
    } else {
      throw new Error('无效的操作');
    }

    report.handleResult = data.handle_result || '';
    report.handledAt = new Date();
    return this.repo.save(report);
  }
}
