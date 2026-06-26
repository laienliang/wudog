import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingRoomTypeEntity } from '../../entity/roomType';
import { LodgingRoomTypeService } from '../../service/roomType';

@CoolController({
  prefix: '/admin/lodging/roomType',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LodgingRoomTypeEntity,
  service: LodgingRoomTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['hostelId'],
  },
})
export class AdminLodgingRoomTypeController extends BaseController {}
