import { CoolController, BaseController, CoolCache } from '@cool-midway/core';
import { ClothingCategoryEntity } from '../../entity/category';
import { ClothingCategoryService } from '../../service/category';

@CoolController({
  api: ['list', 'info'],
  entity: ClothingCategoryEntity,
  service: ClothingCategoryService,
  listQueryOp: {
    // list 接口添加 1 小时缓存
    cache: 60 * 60,
  },
})
export class OpenClothingCategoryController extends BaseController {}
