import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Provide } from '@midwayjs/core';
import { In, Repository } from 'typeorm';
import { WudongFavoriteEntity } from '../entity/favorite';
import { WudongProductCategoryEntity } from '../entity/product-category';
import { WudongProductImageEntity } from '../entity/product-image';
import { WudongProductEntity } from '../entity/product';
import { WudongProductSkuEntity } from '../entity/product-sku';

@Provide()
export class WudongFavoriteService extends BaseService {
  @InjectEntityModel(WudongFavoriteEntity)
  favoriteEntity: Repository<WudongFavoriteEntity>;

  @InjectEntityModel(WudongProductEntity)
  productEntity: Repository<WudongProductEntity>;

  @InjectEntityModel(WudongProductCategoryEntity)
  productCategoryEntity: Repository<WudongProductCategoryEntity>;

  @InjectEntityModel(WudongProductImageEntity)
  productImageEntity: Repository<WudongProductImageEntity>;

  @InjectEntityModel(WudongProductSkuEntity)
  productSkuEntity: Repository<WudongProductSkuEntity>;

  private getPageParams(query) {
    const page = Math.max(Number(query?.page) || 1, 1);
    const pageSize = Math.max(Number(query?.pageSize) || 10, 1);
    return { page, pageSize };
  }

  private async getPublishedProduct(productId: number) {
    const product = await this.productEntity.findOneBy({
      id: Number(productId),
      deleted: 0,
      status: 1,
    });

    if (!product) {
      throw new CoolCommException('商品不存在或未上架');
    }

    const category = await this.productCategoryEntity.findOneBy({
      id: product.categoryId,
      deleted: 0,
      status: 1,
    });

    if (!category) {
      throw new CoolCommException('商品不存在或未上架');
    }

    return product;
  }

  async addFavorite(productId: number, userId: number) {
    await this.getPublishedProduct(productId);
    const current = await this.favoriteEntity.findOneBy({ userId, productId });

    if (current) {
      if (current.deleted === 0) {
        return;
      }
      await this.favoriteEntity.save({
        ...current,
        deleted: 0,
      });
      return;
    }

    try {
      await this.favoriteEntity.insert({
        userId,
        productId,
        deleted: 0,
      });
    } catch (error) {
      const latest = await this.favoriteEntity.findOneBy({ userId, productId });
      if (!latest) {
        throw error;
      }
      if (latest.deleted === 1) {
        await this.favoriteEntity.save({
          ...latest,
          deleted: 0,
        });
      }
    }
  }

  async deleteFavorite(productId: number, userId: number) {
    const current = await this.favoriteEntity.findOneBy({
      userId,
      productId,
    });
    if (!current || current.deleted === 1) {
      return;
    }
    await this.favoriteEntity.save({
      ...current,
      deleted: 1,
    });
  }

  async pageData(query, userId: number) {
    const { page, pageSize } = this.getPageParams(query);
    const qb = this.favoriteEntity
      .createQueryBuilder('f')
      .innerJoin(
        WudongProductEntity,
        'p',
        'p.id = f.productId and p.deleted = 0 and p.status = 1'
      )
      .innerJoin(
        WudongProductCategoryEntity,
        'c',
        'c.id = p.categoryId and c.deleted = 0 and c.status = 1'
      )
      .where('f.userId = :userId', { userId })
      .andWhere('f.deleted = :deleted', { deleted: 0 })
      .orderBy('f.id', 'DESC');

    const total = await qb.getCount();
    const favorites = await qb
      .clone()
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
    const productIds = favorites.map(item => item.productId);

    if (!productIds.length) {
      return {
        total,
        page,
        pageSize,
        list: [],
      };
    }

    const [products, categories, images, skus] = await Promise.all([
      this.productEntity.find({
        where: {
          id: In(productIds),
          deleted: 0,
          status: 1,
        },
      }),
      this.productCategoryEntity.find({
        where: {
          deleted: 0,
          status: 1,
        },
      }),
      this.productImageEntity.find({
        where: {
          productId: In(productIds),
          deleted: 0,
        },
        order: {
          isMain: 'DESC',
          sortOrder: 'ASC',
          id: 'ASC',
        },
      }),
      this.productSkuEntity.find({
        where: {
          productId: In(productIds),
          deleted: 0,
          status: 1,
        },
      }),
    ]);

    const categoryMap = new Map(categories.map(item => [item.id, item]));
    const imageMap = new Map<number, WudongProductImageEntity[]>();
    const skuMap = new Map<number, WudongProductSkuEntity[]>();

    images.forEach(item => {
      const list = imageMap.get(item.productId) || [];
      list.push(item);
      imageMap.set(item.productId, list);
    });

    skus.forEach(item => {
      const list = skuMap.get(item.productId) || [];
      list.push(item);
      skuMap.set(item.productId, list);
    });

    const productMap = new Map(
      products
        .filter(item => categoryMap.has(item.categoryId))
        .map(item => [item.id, item])
    );

    const list = favorites
      .map(item => {
        const product = productMap.get(item.productId);
        if (!product) {
          return null;
        }
        const productImages = imageMap.get(product.id) || [];
        const cover = productImages.find(image => image.isMain === 1) || productImages[0];
        const productSkus = skuMap.get(product.id) || [];
        return {
          favoriteId: item.id,
          productId: product.id,
          title: product.title,
          subtitle: product.subtitle,
          minPrice: Number(product.minPrice || 0),
          maxPrice: Number(product.maxPrice || 0),
          coverImage: cover?.url || '',
          soldOut:
            productSkus.length === 0 ||
            productSkus.every(sku => Number(sku.stock) <= 0),
          categoryName: categoryMap.get(product.categoryId)?.name || '',
          createTime: item.createTime,
        };
      })
      .filter(Boolean);

    return {
      total,
      page,
      pageSize,
      list,
    };
  }
}
