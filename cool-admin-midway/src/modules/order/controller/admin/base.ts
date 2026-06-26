import { CoolController, BaseController } from '@cool-midway/core';
import { OrderBaseEntity } from '../../entity/base';
import { OrderService } from '../../service/base';

/**
 * 订单管理
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: OrderBaseEntity,
  service: OrderService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo'],
    fieldEq: ['moduleType', 'status'],
  },
})
export class AdminOrderBaseController extends BaseController {}
