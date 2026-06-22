import { CoolController, BaseController } from '@cool-midway/core';
import { RefundRecordEntity } from '../../entity/refund';
import { RefundService } from '../../service/refund';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: RefundRecordEntity,
  service: RefundService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo'],
    fieldEq: ['status'],
  },
})
export class AdminRefundController extends BaseController {}
