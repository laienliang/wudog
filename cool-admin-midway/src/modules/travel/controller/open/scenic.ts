import { CoolController, BaseController } from '@cool-midway/core';
import { TravelScenicEntity } from '../../entity/scenic';
import { TravelScenicService } from '../../service/scenic';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: TravelScenicEntity,
  service: TravelScenicService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
    fieldEq: ['status'],
    // page 和 list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenTravelScenicController extends BaseController {}
