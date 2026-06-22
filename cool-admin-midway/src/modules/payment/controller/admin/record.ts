import { CoolController, BaseController } from '@cool-midway/core';
import { PaymentRecordEntity } from '../../entity/record';
import { PaymentService } from '../../service/record';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PaymentRecordEntity,
  service: PaymentService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo'],
    fieldEq: ['status', 'payType'],
  },
})
export class AdminPaymentController extends BaseController {}
