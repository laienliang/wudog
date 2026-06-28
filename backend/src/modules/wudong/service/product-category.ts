import { CoolCommException, BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { WudongProductCategoryEntity } from '../entity/product-category';

@Provide()
export class WudongProductCategoryService extends BaseService {
  @InjectEntityModel(WudongProductCategoryEntity)
  productCategoryEntity: Repository<WudongProductCategoryEntity>;

  private getPageParams(query) {
    const page = Math.max(Number(query?.page) || 1, 1);
    const pageSize = Math.max(Number(query?.pageSize) || 10, 1);
    return { page, pageSize };
  }

  async pageData(query) {
    const { page, pageSize } = this.getPageParams(query);
    const keyWord = String(query?.keyWord || '').trim();
    const qb = this.productCategoryEntity
      .createQueryBuilder('c')
      .where('c.deleted = :deleted', { deleted: 0 });

    if (keyWord) {
      qb.andWhere('c.name like :keyWord', { keyWord: `%${keyWord}%` });
    }

    if (
      query?.status === 0 ||
      query?.status === 1 ||
      query?.status === '0' ||
      query?.status === '1'
    ) {
      qb.andWhere('c.status = :status', { status: Number(query.status) });
    }

    qb.orderBy('c.sortOrder', 'ASC')
      .addOrderBy('c.id', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return {
      total,
      page,
      pageSize,
      list,
    };
  }

  async listEnabled() {
    return this.productCategoryEntity.find({
      where: {
        status: 1,
        deleted: 0,
      },
      order: {
        sortOrder: 'ASC',
        id: 'DESC',
      },
    });
  }

  async infoById(id: number) {
    const info = await this.productCategoryEntity.findOneBy({
      id: Number(id),
      deleted: 0,
    });
    if (!info) {
      throw new CoolCommException('商品分类不存在');
    }
    return info;
  }

  async saveCategory(param) {
    const id = Number(param?.id) || undefined;
    const name = String(param?.name || '').trim();
    if (!name) {
      throw new CoolCommException('分类名称不能为空');
    }

    const duplicate = await this.productCategoryEntity
      .createQueryBuilder('c')
      .where('c.deleted = :deleted', { deleted: 0 })
      .andWhere('c.name = :name', { name })
      .andWhere(id ? 'c.id <> :id' : '1 = 1', { id })
      .getOne();

    if (duplicate) {
      throw new CoolCommException('分类名称已存在');
    }

    let entity: WudongProductCategoryEntity;
    if (id) {
      entity = await this.infoById(id);
    } else {
      entity = this.productCategoryEntity.create();
    }

    const saved = await this.productCategoryEntity.save({
      ...entity,
      name,
      status: Number(param?.status ?? entity?.status ?? 1),
      sortOrder: Number(param?.sortOrder ?? entity?.sortOrder ?? 0),
      remark: param?.remark ? String(param.remark).trim() : null,
      deleted: 0,
    });

    return { id: saved.id };
  }

  async setStatus(id: number, status: number) {
    const info = await this.infoById(id);
    info.status = Number(status) === 1 ? 1 : 0;
    await this.productCategoryEntity.save(info);
  }

  async softDelete(ids: number[]) {
    if (!ids.length) {
      throw new CoolCommException('请选择要删除的分类');
    }
    await this.productCategoryEntity
      .createQueryBuilder()
      .update(WudongProductCategoryEntity)
      .set({
        deleted: 1,
        status: 0,
        updateTime: new Date() as any,
      })
      .where('id in (:...ids)', { ids })
      .execute();
  }
}
