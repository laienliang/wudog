import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingHostelEntity } from '../../entity/hostel';
import { LodgingHostelService } from '../../service/hostel';

@CoolController({
  prefix: '/admin/lodging/hostel',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LodgingHostelEntity,
  service: LodgingHostelService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
    fieldEq: ['status', 'merchantId'],
  },
})
export class AdminLodgingHostelController extends BaseController {}
