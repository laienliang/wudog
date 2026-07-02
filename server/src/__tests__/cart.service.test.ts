import { CartService } from '../service/cart.service';

function mockRepo(overrides: any = {}) {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((d) => d),
    save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),
    remove: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as any;
}

describe('CartService', () => {
  let service: CartService;
  let cartRepo: any;

  beforeEach(() => {
    cartRepo = mockRepo();
    service = new CartService(cartRepo);
  });

  describe('getCart', () => {
    it('应该返回用户购物车列表', async () => {
      cartRepo.find.mockResolvedValue([{ id: 1, product_id: 10, quantity: 2 }]);

      const items = await service.getCart(1);

      expect(items).toHaveLength(1);
      expect(cartRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 1 } }),
      );
    });
  });

  describe('addItem', () => {
    it('新增商品到购物车', async () => {
      cartRepo.findOne.mockResolvedValue(null);

      const result = await service.addItem(1, {
        product_id: 10, quantity: 2, source_module: 'module1',
      });

      expect(result.quantity).toBe(2);
      expect(cartRepo.create).toHaveBeenCalledTimes(1);
    });

    it('已存在相同商品时累加数量', async () => {
      const existing = { id: 5, user_id: 1, product_id: 10, quantity: 3 };
      cartRepo.findOne.mockResolvedValue(existing);

      await service.addItem(1, { product_id: 10, quantity: 2, source_module: 'module1' });

      expect(existing.quantity).toBe(5);
      expect(cartRepo.save).toHaveBeenCalledWith(existing);
    });
  });

  describe('updateItem', () => {
    it('更新数量', async () => {
      const item = { id: 1, user_id: 1, product_id: 10, quantity: 3 };
      cartRepo.findOne.mockResolvedValue(item);

      await service.updateItem(1, 1, 5);

      expect(item.quantity).toBe(5);
    });

    it('数量为 0 时删除', async () => {
      const item = { id: 1, user_id: 1, product_id: 10, quantity: 3 };
      cartRepo.findOne.mockResolvedValue(item);

      const result = await service.updateItem(1, 1, 0);

      expect(result).toBeNull();
      expect(cartRepo.remove).toHaveBeenCalledWith(item);
    });

    it('不存在时抛错', async () => {
      cartRepo.findOne.mockResolvedValue(null);

      await expect(service.updateItem(1, 999, 2)).rejects.toThrow('购物车项不存在');
    });
  });

  describe('deleteItem', () => {
    it('删除指定项', async () => {
      cartRepo.findOne.mockResolvedValue({ id: 5, user_id: 1 });

      await service.deleteItem(1, 5);

      expect(cartRepo.remove).toHaveBeenCalled();
    });

    it('不存在时抛错', async () => {
      cartRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteItem(1, 999)).rejects.toThrow('购物车项不存在');
    });
  });

  describe('clearCart', () => {
    it('清空用户购物车', async () => {
      await service.clearCart(1);

      expect(cartRepo.delete).toHaveBeenCalledWith({ user_id: 1 });
    });
  });
});
