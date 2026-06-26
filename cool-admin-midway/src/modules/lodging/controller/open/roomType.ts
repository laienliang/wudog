import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingRoomTypeEntity } from '../../entity/roomType';

@CoolController({
  prefix: '/open/lodging/roomType',
  api: ['list'],
  entity: LodgingRoomTypeEntity,
  listQueryOp: {
    keyWordLikeFields: ['name'],
    fieldEq: ['hostelId'],
    // list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenLodgingRoomTypeController extends BaseController {}
