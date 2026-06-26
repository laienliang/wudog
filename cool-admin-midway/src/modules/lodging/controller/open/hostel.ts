import { CoolController, BaseController } from '@cool-midway/core';
import { LodgingHostelEntity } from '../../entity/hostel';

@CoolController({
  prefix: '/open/lodging/hostel',
  api: ['page', 'info', 'list'],
  entity: LodgingHostelEntity,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
    fieldEq: ['status'],
    // page 和 list 接口添加 30 分钟缓存
    cache: 30 * 60,
  },
})
export class OpenLodgingHostelController extends BaseController {}
