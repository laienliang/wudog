import { CoolController, BaseController } from '@cool-midway/core';
import { MerchantEntity } from '../../entity/merchant';
import { MerchantService } from '../../service/merchant';

@CoolController({
  prefix: '/admin/merchant',
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MerchantEntity,
  service: MerchantService,
  pageQueryOp: {
    keyWordLikeFields: ['shopName', 'contactName'],
    fieldEq: ['moduleType', 'status'],
  },
})
export class AdminMerchantController extends BaseController {}
