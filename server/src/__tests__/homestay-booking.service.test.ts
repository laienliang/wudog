import { HomestayBookingService } from '../service/homestay-booking.service';
import { BookingStatus } from '../entity/homestay-booking.entity';

function mockRepo(overrides: any = {}) {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    create: jest.fn().mockImplementation((d) => d),
    save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
    ...overrides,
  } as any;
}

describe('HomestayBookingService', () => {
  let service: HomestayBookingService;
  let repo: any;

  beforeEach(() => {
    repo = mockRepo();
    service = new HomestayBookingService(repo);
  });

  describe('create', () => {
    it('应该创建民宿预订', async () => {
      const result = await service.create(1, {
        homestay_id: 10,
        room_type_id: 20,
        check_in_date: '2026-07-15',
        check_out_date: '2026-07-18',
        nights: 3,
        room_count: 2,
        guest_name: '张三',
        guest_phone: '13800138000',
        total_amount: 1200,
      });

      expect(result.status).toBe(BookingStatus.PENDING);
      expect(result.guestName).toBe('张三');
      expect(result.totalAmount).toBe(1200);
    });

    it('默认 room_count 为 1', async () => {
      const result = await service.create(1, {
        homestay_id: 10,
        room_type_id: 20,
        check_in_date: '2026-07-15',
        check_out_date: '2026-07-16',
        nights: 1,
        guest_name: '李四',
        guest_phone: '13900000000',
        total_amount: 300,
      });

      expect(result.roomCount).toBe(1);
    });
  });

  describe('list', () => {
    it('返回用户预订列表', async () => {
      repo.find.mockResolvedValue([
        { id: 1, homestayId: 10, status: 'pending' },
        { id: 2, homestayId: 20, status: 'confirmed' },
      ]);

      const bookings = await service.list(1);

      expect(bookings).toHaveLength(2);
    });
  });

  describe('listAll', () => {
    it('返回分页列表', async () => {
      repo.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

      const result = await service.listAll({});

      expect(result.list).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('支持 status 筛选', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.listAll({ status: 'pending' });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'pending', isDeleted: 0 } }),
      );
    });
  });

  describe('updateStatus', () => {
    it('按合法流转更新状态', async () => {
      repo.findOne.mockResolvedValue({ id: 1, status: 'pending', isDeleted: 0 });

      const result = await service.updateStatus(1, { status: 'confirmed' });

      expect(result.status).toBe('confirmed');
    });

    it('非法状态流转抛错', async () => {
      repo.findOne.mockResolvedValue({ id: 1, status: 'completed', isDeleted: 0 });

      await expect(service.updateStatus(1, { status: 'cancelled' })).rejects.toThrow('不允许从 completed 变更为 cancelled');
    });

    it('预订不存在时抛错', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(999, { status: 'confirmed' })).rejects.toThrow('预订不存在');
    });
  });

  describe('cancel', () => {
    it('用户取消 pending 预订', async () => {
      repo.findOne.mockResolvedValue({ id: 1, userId: 1, status: 'pending', isDeleted: 0 });

      const result = await service.cancel(1, 1);

      expect(result.status).toBe(BookingStatus.CANCELLED);
    });

    it('用户取消 paid 预订', async () => {
      repo.findOne.mockResolvedValue({ id: 2, userId: 2, status: 'paid', isDeleted: 0 });

      const result = await service.cancel(2, 2);

      expect(result.status).toBe(BookingStatus.CANCELLED);
    });

    it('completed 状态不能取消', async () => {
      repo.findOne.mockResolvedValue({ id: 1, userId: 1, status: 'completed', isDeleted: 0 });

      await expect(service.cancel(1, 1)).rejects.toThrow('当前状态不可取消');
    });

    it('退款中不能取消', async () => {
      repo.findOne.mockResolvedValue({ id: 1, userId: 1, status: 'refunding', isDeleted: 0 });

      await expect(service.cancel(1, 1)).rejects.toThrow('当前状态不可取消');
    });

    it('不是本人的预订不能取消', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.cancel(2, 1)).rejects.toThrow('预订不存在');
    });
  });
});
