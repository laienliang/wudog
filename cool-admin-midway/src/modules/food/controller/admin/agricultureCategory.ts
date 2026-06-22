import { CoolController, BaseController } from '@cool-midway/core';
import { FoodAgricultureCategoryEntity } from '../../entity/agricultureCategory';
import { FoodAgricultureCategoryService } from '../../service/agricultureCategory';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FoodAgricultureCategoryEntity,
  service: FoodAgricultureCategoryService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['parentId'],
  },
})
export class AdminFoodAgricultureCategoryController extends BaseController {}
