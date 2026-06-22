import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from '../entity/merchant';

@Provide()
export class MerchantService extends BaseService {
  @InjectEntityModel(MerchantEntity)
  merchantEntity: Repository<MerchantEntity>;
}
