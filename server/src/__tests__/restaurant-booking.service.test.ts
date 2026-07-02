import { RestaurantBookingService } from '../service/restaurant-booking.service';

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

describe('RestaurantBookingService', () => {
  let service: RestaurantBookingService;
  let bookingRepo: any;

  beforeEach(() => {
    bookingRepo = mockRepo();
    const slotRepo = mockRepo();
    const restaurantRepo = mockRepo();
    service = new RestaurantBookingService(bookingRepo, slotRepo, restaurantRepo);
  });

  describe('list', () => {
    it('返回用户预订列表', async () => {
      bookingRepo.findAndCount.mockResolvedValue([
        [{ id: 1, restaurantId: 10, status: 'confirmed' }], 1,
      ]);

      const result = await service.list(1);

      expect(result.list).toHaveLength(1);
    });
  });

  describe('listAll', () => {
    it('管理员查询所有预订', async () => {
      bookingRepo.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);

      const result = await service.listAll({});

      expect(result.list).toHaveLength(1);
    });

    it('支持多条件筛选', async () => {
      bookingRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.listAll({ status: 'pending', restaurant_id: 5 });

      expect(bookingRepo.findAndCount).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('用户取消 pending 预订', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 1, userId: 1, status: 'pending', isDeleted: 0,
      });

      const result = await service.cancel(1, 1);

      expect(result.status).toBe('cancelled');
    });

    it('用户取消 confirmed 预订', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 1, userId: 1, status: 'confirmed', isDeleted: 0,
      });

      const result = await service.cancel(1, 1);

      expect(result.status).toBe('cancelled');
    });

    it('completed 不能取消', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 1, userId: 1, status: 'completed', isDeleted: 0,
      });

      await expect(service.cancel(1, 1)).rejects.toThrow('当前状态不可取消');
    });

    it('rejected 不能取消', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 1, userId: 1, status: 'rejected', isDeleted: 0,
      });

      await expect(service.cancel(1, 1)).rejects.toThrow('当前状态不可取消');
    });

    it('非本人预订抛错', async () => {
      bookingRepo.findOne.mockResolvedValue(null);

      await expect(service.cancel(2, 1)).rejects.toThrow('预订不存在');
    });
  });

  describe('updateStatus', () => {
    it('确认 pending 预订', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 1, status: 'pending', isDeleted: 0,
      });

      const result = await service.updateStatus(1, { status: 'confirmed' });

      expect(result.status).toBe('confirmed');
    });

    it('拒绝 pending 预订', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 1, status: 'pending', isDeleted: 0,
      });

      const result = await service.updateStatus(1, { status: 'rejected', merchant_remark: '已满座' });

      expect(result.status).toBe('rejected');
    });

    it('非法状态变更抛错', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 1, status: 'completed', isDeleted: 0,
      });

      await expect(service.updateStatus(1, { status: 'confirmed' })).rejects.toThrow('状态变更不允许');
    });
  });
});
