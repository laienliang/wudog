import { ProductService } from '../service/product.service';

function mockRepo(overrides: any = {}) {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    create: jest.fn().mockImplementation((d) => d),
    save: jest.fn().mockImplementation((d) => {
      if (Array.isArray(d)) return Promise.resolve(d.map((x: any, i: number) => ({ id: i + 100, ...x })));
      return Promise.resolve({ id: 1, ...d });
    }),
    ...overrides,
  } as any;
}

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: any;
  let skuRepo: any;
  let imageRepo: any;

  beforeEach(() => {
    productRepo = mockRepo();
    skuRepo = mockRepo();
    imageRepo = mockRepo();
    service = new ProductService(productRepo, skuRepo, imageRepo);
  });

  describe('list', () => {
    it('默认查询 published 状态商品', async () => {
      productRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.list({});

      expect(productRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDeleted: 0, status: 'published' } }),
      );
    });

    it('支持分类筛选', async () => {
      productRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.list({ category_id: 3 });

      expect(productRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDeleted: 0, status: 'published', categoryId: 3 } }),
      );
    });
  });

  describe('detail', () => {
    it('返回商品详情含 SKU 和图片', async () => {
      productRepo.findOne.mockResolvedValue({ id: 1, title: '非遗陶瓷', price: 99 });
      skuRepo.find.mockResolvedValue([{ id: 101, specName: '大号' }]);
      imageRepo.find.mockResolvedValue([{ id: 201, url: '/img.jpg' }]);

      const result = await service.detail(1);

      expect(result.title).toBe('非遗陶瓷');
      expect(result.skus).toHaveLength(1);
      expect(result.images).toHaveLength(1);
    });

    it('不存在时抛错', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.detail(999)).rejects.toThrow('商品不存在');
    });
  });

  describe('create', () => {
    it('创建商品含 SKU 和图片', async () => {
      const result = await service.create(1, {
        title: '手工陶瓷',
        category_id: 5,
        price: 199,
        stock: 20,
        skus: [{ spec_name: '大号', price: 199, stock: 10 }],
        images: [{ url: '/a.jpg' }, { url: '/b.jpg' }],
      });

      expect(result.title).toBe('手工陶瓷');
      expect(result.status).toBe('draft');
      expect(skuRepo.save).toHaveBeenCalled();
      expect(imageRepo.save).toHaveBeenCalled();
    });

    it('创建商品默认状态为 draft', async () => {
      const result = await service.create(1, {
        title: '商品', category_id: 1, price: 50,
      });

      expect(result.status).toBe('draft');
    });
  });

  describe('update', () => {
    it('更新商品信息', async () => {
      productRepo.findOne.mockResolvedValue({ id: 1, merchantId: 1, title: '旧', status: 'draft', isDeleted: 0 });

      const result = await service.update(1, 1, { title: '新标题', price: 299 });

      expect(result.title).toBe('新标题');
      expect(result.price).toBe(299);
      expect(result.status).toBe('draft');
    });

    it('无权编辑他人商品时抛错', async () => {
      productRepo.findOne.mockResolvedValue({ id: 1, merchantId: 2, title: '商品', status: 'draft', isDeleted: 0 });

      await expect(service.update(1, 1, { title: 'x' })).rejects.toThrow('无权编辑他人的商品');
    });
  });

  describe('review', () => {
    it('审核通过', async () => {
      productRepo.findOne.mockResolvedValue({ id: 1, title: '商品', status: 'reviewing', isDeleted: 0 });

      const result = await service.review(1, { action: 'approve' });

      expect(result.status).toBe('published');
    });

    it('审核驳回需要原因', async () => {
      productRepo.findOne.mockResolvedValue({ id: 1, status: 'reviewing', isDeleted: 0 });

      await expect(service.review(1, { action: 'reject' })).rejects.toThrow('驳回必须填写原因');
    });

    it('非 reviewing 状态不能审核', async () => {
      productRepo.findOne.mockResolvedValue({ id: 1, status: 'draft', isDeleted: 0 });

      await expect(service.review(1, { action: 'approve' })).rejects.toThrow('只有待审核的商品才能审核');
    });
  });

  describe('delete', () => {
    it('用户删除自己的商品', async () => {
      const product = { id: 1, merchantId: 1, title: '商品', isDeleted: 0 };
      productRepo.findOne.mockResolvedValue(product);

      await service.delete(1, 1);

      expect(product.isDeleted).toBe(1);
    });

    it('管理员可以删除他人商品', async () => {
      const product = { id: 1, merchantId: 2, isDeleted: 0 };
      productRepo.findOne.mockResolvedValue(product);

      await service.delete(1, 1, true);

      expect(product.isDeleted).toBe(1);
    });

    it('非管理员不能删除他人商品', async () => {
      const product = { id: 1, merchantId: 2, isDeleted: 0 };
      productRepo.findOne.mockResolvedValue(product);

      await expect(service.delete(1, 1)).rejects.toThrow('无权删除他人的商品');
    });
  });
});
