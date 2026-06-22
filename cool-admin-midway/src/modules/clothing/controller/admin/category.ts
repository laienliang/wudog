import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingCategoryEntity } from '../../entity/category';
import { ClothingCategoryService } from '../../service/category';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ClothingCategoryEntity,
  service: ClothingCategoryService,
  pageQueryOp: { fieldEq: ['status'] },
})
export class AdminClothingCategoryController extends BaseController {}
