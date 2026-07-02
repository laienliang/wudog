import { TravelNoteService } from '../service/travel-note.service';

function mockRepo(overrides: any = {}) {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    create: jest.fn().mockImplementation((d) => d),
    save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
    increment: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as any;
}

describe('TravelNoteService', () => {
  let service: TravelNoteService;
  let repo: any;

  beforeEach(() => {
    repo = mockRepo();
    service = new TravelNoteService(repo);
  });

  describe('list', () => {
    it('返回分页游记列表', async () => {
      repo.findAndCount.mockResolvedValue([[{ id: 1, title: '游记1' }], 1]);

      const result = await service.list({});

      expect(result.list).toHaveLength(1);
    });

    it('支持关键词搜索', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.list({ keyword: '乌东' });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ title: expect.anything() }) }),
      );
    });

    it('支持话题筛选', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.list({ topic: 5 });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { topicId: 5, isDeleted: 0 } }),
      );
    });
  });

  describe('detail', () => {
    it('返回游记详情并增加浏览量', async () => {
      const note = { id: 1, title: '测试', viewCount: 10, isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      const result = await service.detail(1);

      expect(result.viewCount).toBe(11);
      expect(repo.increment).toHaveBeenCalledWith({ id: 1 }, 'viewCount', 1);
    });

    it('不存在时抛错', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.detail(999)).rejects.toThrow('游记不存在');
    });
  });

  describe('create', () => {
    it('创建草稿游记', async () => {
      const result = await service.create(1, {
        title: '乌东游记',
        content: '今天去了乌东村...',
        images: ['/a.jpg', '/b.jpg'],
        topic_id: 3,
      });

      expect(result.status).toBe('draft');
      expect(result.title).toBe('乌东游记');
      expect(result.images).toHaveLength(2);
    });

    it('不指定 topic_id 也能创建', async () => {
      const result = await service.create(1, {
        title: '无话题游记', content: '内容',
      });

      expect(result.topicId).toBeUndefined();
    });
  });

  describe('update', () => {
    it('编辑草稿游记', async () => {
      const note = { id: 1, userId: 1, status: 'draft', isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      const result = await service.update(1, 1, { title: '修改后标题' });

      expect(result.title).toBe('修改后标题');
      expect(result.status).toBe('draft');
    });

    it('编辑驳回的游记后状态回到草稿', async () => {
      const note = { id: 1, userId: 1, status: 'rejected', isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      const result = await service.update(1, 1, { content: '修改' });

      expect(result.status).toBe('draft');
    });

    it('不能编辑他人的游记', async () => {
      const note = { id: 1, userId: 2, status: 'draft', isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      await expect(service.update(1, 1, { title: 'x' })).rejects.toThrow('无权编辑他人的游记');
    });

    it('不能编辑已发布的游记', async () => {
      const note = { id: 1, userId: 1, status: 'published', isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      await expect(service.update(1, 1, { title: 'x' })).rejects.toThrow('只能编辑草稿或已驳回的游记');
    });
  });

  describe('delete', () => {
    it('用户删除自己的游记', async () => {
      const note = { id: 1, userId: 1, isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      await service.delete(1, 1);

      expect(note.isDeleted).toBe(1);
    });

    it('管理员可以删除他人的游记', async () => {
      const note = { id: 1, userId: 2, isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      await service.delete(1, 1, true);

      expect(note.isDeleted).toBe(1);
    });

    it('非管理员不能删除他人的游记', async () => {
      const note = { id: 1, userId: 2, isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      await expect(service.delete(1, 1)).rejects.toThrow('无权删除他人的游记');
    });
  });

  describe('submitReview', () => {
    it('提交草稿进入审核', async () => {
      const note = { id: 1, userId: 1, title: '游记标题', content: '游记正文...', status: 'draft', isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      const result = await service.submitReview(1, 1);

      expect(result.status).toBe('reviewing');
    });

    it('驳回后可重新提交审核', async () => {
      const note = { id: 1, userId: 1, title: '游记标题', content: '游记正文...', status: 'rejected', isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      const result = await service.submitReview(1, 1);

      expect(result.status).toBe('reviewing');
    });

    it('已发布状态不能提交', async () => {
      const note = { id: 1, userId: 1, title: '标题', content: '内容', status: 'published', isDeleted: 0 };
      repo.findOne.mockResolvedValue(note);

      await expect(service.submitReview(1, 1)).rejects.toThrow('当前状态不可提交审核');
    });
  });
});
