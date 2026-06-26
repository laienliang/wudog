import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingHostelPolicyEntity } from '../../entity/hostelPolicy';
import { LodgingHostelPolicyService } from '../../service/hostelPolicy';

@CoolController({
  prefix: '/admin/lodging/hostelPolicy',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LodgingHostelPolicyEntity,
  service: LodgingHostelPolicyService,
  pageQueryOp: {
    keyWordLikeFields: [],
    fieldEq: ['hostelId', 'includeBreakfast'],
  },
})
export class AdminLodgingHostelPolicyController extends BaseController {}
