import { CarHistoryService } from './car-history.service';
import { CarRegisService } from './car-regis.service';
import { ReceiveDepositService } from './receive-deposit.service';

export const services: any[] = [
  CarHistoryService,
  CarRegisService,
  ReceiveDepositService
]

export * from './car-history.service';
export * from './car-regis.service';
export * from './receive-deposit.service';