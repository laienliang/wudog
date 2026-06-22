import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRecordEntity } from '../entity/record';

@Provide()
export class PaymentService extends BaseService {
  @InjectEntityModel(PaymentRecordEntity)
  paymentRecordEntity: Repository<PaymentRecordEntity>;
}
