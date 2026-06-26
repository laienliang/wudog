import { CoolController, BaseController } from '@cool-midway/core';
import { FoodAgricultureCategoryEntity } from '../../entity/agricultureCategory';
import { FoodAgricultureCategoryService } from '../../service/agricultureCategory';

/**
 * 农产品分类公开接口
 */
@CoolController({
  api: ['page', 'info', 'list'],
  entity: FoodAgricultureCategoryEntity,
  service: FoodAgricultureCategoryService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['parentId'],
  },
})
export class OpenFoodAgricultureCategoryController extends BaseController {}
