import { CoolController, BaseController } from '@cool-midway/core';
import { OrderBaseEntity } from '../../entity/base';
import { OrderService } from '../../service/base';

/**
 * 订单公开接口
 */
@CoolController({
  api: ['page', 'info', 'list'],
  entity: OrderBaseEntity,
  service: OrderService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo'],
    fieldEq: ['userId', 'moduleType', 'status'],
  },
})
export class OpenOrderBaseController extends BaseController {}
