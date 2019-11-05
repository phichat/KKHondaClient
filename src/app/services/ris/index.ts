import { CarHistoryService } from './car-history.service';
import { CarRegisService } from './car-regis.service';
import { ReceiveDepositService } from './receive-deposit.service';
import { ExpenseOtherService } from './expense-other.service';

export const services: any[] = [
  CarHistoryService,
  CarRegisService,
  ReceiveDepositService,
  ExpenseOtherService
]

export * from './car-history.service';
export * from './car-regis.service';
export * from './receive-deposit.service';
export * from './expense-other.service';