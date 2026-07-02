import { OrderService } from '../service/order.service';

function mockRepo(overrides: any = {}) {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    create: jest.fn().mockImplementation((d) => d),
    save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
    createQueryBuilder: jest.fn(),
    ...overrides,
  } as any;
}

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: any;
  let orderItemRepo: any;
  let paymentRepo: any;
  let notifRepo: any;

  beforeEach(() => {
    orderRepo = mockRepo();
    orderItemRepo = mockRepo();
    paymentRepo = mockRepo();
    notifRepo = mockRepo();
    service = new OrderService(orderRepo, orderItemRepo, paymentRepo, notifRepo);
  });

  describe('createOrder', () => {
    it('应该创建订单和订单项', async () => {
      const result = await service.createOrder(1, {
        type: 'product',
        items: [
          { item_id: 10, item_name: '非遗陶瓷', price: 99, quantity: 2 },
          { item_id: 20, item_name: '手工布艺', price: 49, quantity: 1 },
        ],
      });

      expect(result.total_amount).toBe(247);
      expect(orderRepo.save).toHaveBeenCalled();
      expect(orderItemRepo.save).toHaveBeenCalledTimes(2);
    });

    it('缺少 type 或 items 时抛错', async () => {
      await expect(service.createOrder(1, { type: null, items: [] })).rejects.toThrow('订单类型和商品不能为空');
      await expect(service.createOrder(1, { type: 'product', items: [] })).rejects.toThrow('订单类型和商品不能为空');
    });

    it('订单号格式正确', async () => {
      const result = await service.createOrder(1, {
        type: 'homestay',
        items: [{ item_id: 1, item_name: '民宿', price: 500, quantity: 1 }],
      });

      expect(result.order_no).toMatch(/^WD\d+/);
    });
  });

  describe('cancelOrder', () => {
    it('应该取消待支付订单', async () => {
      const order = { id: 1, status: 'pending', user_id: 1 };
      orderRepo.findOne.mockResolvedValue(order);

      const result = await service.cancelOrder(1, 1);

      expect(result.status).toBe('cancelled');
      expect(result.cancel_time).toBeDefined();
    });

    it('非待支付状态不能取消', async () => {
      orderRepo.findOne.mockResolvedValue({ id: 1, status: 'paid', user_id: 1 });

      await expect(service.cancelOrder(1, 1)).rejects.toThrow('只能取消待支付订单');
    });

    it('订单不存在时抛错', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.cancelOrder(1, 999)).rejects.toThrow('订单不存在');
    });
  });

  describe('mockPay', () => {
    it('应该模拟支付成功并创建支付记录和通知', async () => {
      orderRepo.findOne.mockResolvedValue({
        id: 1, status: 'pending', user_id: 1, pay_amount: 99, order_no: 'WD123',
      });

      const result = await service.mockPay(1, 1);

      expect(result.order.status).toBe('paid');
      expect(paymentRepo.save).toHaveBeenCalled();
      expect(notifRepo.save).toHaveBeenCalled();
    });

    it('非待支付状态不能支付', async () => {
      orderRepo.findOne.mockResolvedValue({ id: 1, status: 'paid', user_id: 1 });

      await expect(service.mockPay(1, 1)).rejects.toThrow('订单状态不正确');
    });
  });

  describe('confirmReceive', () => {
    it('应该确认收货', async () => {
      orderRepo.findOne.mockResolvedValue({ id: 1, status: 'shipped', user_id: 1 });

      const result = await service.confirmReceive(1, 1);

      expect(result.status).toBe('completed');
      expect(result.finish_time).toBeDefined();
    });

    it('非已发货状态不能确认', async () => {
      orderRepo.findOne.mockResolvedValue({ id: 1, status: 'pending', user_id: 1 });

      await expect(service.confirmReceive(1, 1)).rejects.toThrow('订单未发货');
    });
  });

  describe('getOrderDetail', () => {
    it('返回订单详情含订单项和支付信息', async () => {
      orderRepo.findOne.mockResolvedValue({ id: 1, order_no: 'WD123', user_id: 1, status: 'paid' });
      orderItemRepo.find.mockResolvedValue([{ id: 1, item_name: '物品' }]);
      paymentRepo.findOne.mockResolvedValue(null);

      const detail = await service.getOrderDetail(1);

      expect(detail.items).toHaveLength(1);
      expect(detail.order_no).toBe('WD123');
    });

    it('传入 userId 时校验所属人', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.getOrderDetail(1, 2)).rejects.toThrow('订单不存在');
    });
  });
});
