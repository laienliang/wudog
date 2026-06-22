import { CoolController, BaseController } from '@cool-midway/core';
import { FoodTimeSlotEntity } from '../../entity/timeSlot';
import { FoodTimeSlotService } from '../../service/timeSlot';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FoodTimeSlotEntity,
  service: FoodTimeSlotService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['restaurantId'],
  },
})
export class AdminFoodTimeSlotController extends BaseController {}
