import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingCategoryEntity } from '../entity/category';

@Provide()
export class ClothingCategoryService extends BaseService {
  @InjectEntityModel(ClothingCategoryEntity)
  clothingCategoryEntity: Repository<ClothingCategoryEntity>;
}
