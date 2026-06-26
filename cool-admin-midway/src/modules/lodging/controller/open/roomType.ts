import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingRoomTypeEntity } from '../../entity/roomType';

@CoolController({
  prefix: '/open/lodging/roomType',
  api: ['list'],
  entity: LodgingRoomTypeEntity,
  listQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['hostelId'],
  },
})
export class OpenLodgingRoomTypeController extends BaseController {}
