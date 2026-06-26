import { CoolController, BaseController } from '@cool-midway/core';
import { TravelScenicEntity } from '../../entity/scenic';
import { TravelScenicService } from '../../service/scenic';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TravelScenicEntity,
  service: TravelScenicService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
    fieldEq: ['merchantId', 'status'],
  },
})
export class AdminTravelScenicController extends BaseController {}
