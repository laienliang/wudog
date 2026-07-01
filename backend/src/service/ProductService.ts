import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RedisServiceFactory } from '@midwayjs/redis';
import { Product } from '../entity/Product';

@Provide()
export class ProductService {
  @InjectEntityModel(Product)
  productRepo: Repository<Product>;

  @Inject()
  redisFactory: RedisServiceFactory;

  private get redis() {
    return this.redisFactory.get('default');
  }

  private getCacheKey(page: number, pageSize: number, keyword?: string, categoryId?: number) {
    return `product:list:${page}:${pageSize}:${keyword || ''}:${categoryId || ''}`;
  }

  private filterImages(product: any) {
    if (product?.images) {
      product.images = product.images.filter(img => img.is_deleted === 0);
    }
    return product;
  }

  async list(page = 1, pageSize = 20, keyword?: string, categoryId?: number) {
    const cacheKey = this.getCacheKey(page, pageSize, keyword, categoryId);

    // 尝试从 Redis 获取缓存
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Redis 不可用时继续查数据库
    }

    // 查询数据库
    const where: any = { is_deleted: 0 };
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }
    if (categoryId) {
      where.category_id = categoryId;
    }

    const [list, total] = await this.productRepo.findAndCount({
      where,
      relations: ['category', 'skus', 'images'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const enrichedList = list.map(product => {
      this.filterImages(product);
      return {
        ...product,
        sold_out: product.stock <= 0,
        min_price: product.price,
      };
    });

    const result = { total, page, pageSize, list: enrichedList };

    // 写入缓存，TTL 60秒
    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
    } catch {
      // Redis 不可用时忽略
    }

    return result;
  }

  async detail(id: number) {
    const product = await this.productRepo.findOne({
      where: { id, is_deleted: 0 },
      relations: ['category', 'skus', 'images'],
    });
    if (!product) return null;

    this.filterImages(product);
    return {
      ...product,
      sold_out: product.stock <= 0,
      min_price: product.price,
    };
  }

  private async clearListCache() {
    try {
      const keys = await this.redis.keys('product:list:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch {
      // Redis 不可用时忽略
    }
  }

  async create(data: Partial<Product>) {
    const product = this.productRepo.create(data);
    const result = await this.productRepo.save(product);
    await this.clearListCache();
    return result;
  }

  async update(id: number, data: Partial<Product>) {
    await this.productRepo.update(id, data);
    await this.clearListCache();
    const product = await this.productRepo.findOne({ where: { id }, relations: ['category', 'skus', 'images'] });
    return this.filterImages(product);
  }

  async delete(id: number) {
    await this.productRepo.update(id, { is_deleted: 1 });
    await this.clearListCache();
    return { success: true };
  }

  async toggleStatus(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) return null;
    const newStatus = product.status === 1 ? 0 : 1;
    await this.productRepo.update(id, { status: newStatus });
    await this.clearListCache();
    const updated = await this.productRepo.findOne({ where: { id }, relations: ['category', 'skus', 'images'] });
    return this.filterImages(updated);
  }
}
