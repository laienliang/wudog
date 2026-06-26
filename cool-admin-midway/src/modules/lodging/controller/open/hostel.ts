import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingHostelEntity } from '../../entity/hostel';

@CoolController({
  prefix: '/open/lodging/hostel',
  api: ['page', 'info', 'list'],
  entity: LodgingHostelEntity,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
    fieldEq: ['status'],
  },
})
export class OpenLodgingHostelController extends BaseController {}
