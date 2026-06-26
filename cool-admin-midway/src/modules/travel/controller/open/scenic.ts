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
  },
})
export class OpenTravelScenicController extends BaseController {}
