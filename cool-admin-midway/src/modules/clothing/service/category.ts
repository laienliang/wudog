import { Provide } from '@midwayjs/core';
import { CoolCache, BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingCategoryEntity } from '../entity/category';

@Provide()
export class ClothingCategoryService extends BaseService {
  @InjectEntityModel(ClothingCategoryEntity)
  clothingCategoryEntity: Repository<ClothingCategoryEntity>;

  @CoolCache(60 * 60 * 1000) // 1 小时缓存，分类数据相对稳定
  async list(query?, option?, connectionName?) {
    return super.list(query, option, connectionName);
  }
}
