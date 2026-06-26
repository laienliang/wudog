import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingCollectEntity } from '../../entity/collect';
import { LodgingCollectService } from '../../service/collect';

@CoolController({
  prefix: '/admin/lodging/collect',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LodgingCollectEntity,
  service: LodgingCollectService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['userId', 'hostelId'],
  },
})
export class AdminLodgingCollectController extends BaseController {}
