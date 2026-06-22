import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingCategoryEntity } from '../../entity/category';
import { ClothingCategoryService } from '../../service/category';

@CoolController({
  api: ['list', 'info'],
  entity: ClothingCategoryEntity,
  service: ClothingCategoryService,
})
export class OpenClothingCategoryController extends BaseController {}
