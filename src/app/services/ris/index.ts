import { CarHistoryService } from './car-history.service';
import { CarRegisService } from './car-regis.service';
import { ReceiveDepositService } from './receive-deposit.service';
import { ExpenseOtherService } from './expense-other.service';
import { SedRegisService } from './sed-regis.service';
import { CarListItemService } from './car-list-item.service';
import { ClRegisService } from './cl-regis.service';
import { AlRegisService } from './al-regis.service';
import { RevRegisService } from './rev-regis.service';
import { CarRegisItemService } from './car-regis-item.service';

export const services: any[] = [
  CarHistoryService,
  CarRegisService,
  ReceiveDepositService,
  ExpenseOtherService,
  SedRegisService,
  CarListItemService,
  ClRegisService,
  AlRegisService,
  RevRegisService,
  CarRegisItemService
]

export * from './car-history.service';
export * from './car-regis.service';
export * from './receive-deposit.service';
export * from './expense-other.service';
export * from './sed-regis.service';
export * from './car-list-item.service';
export * from './cl-regis.service';
export * from './al-regis.service';
export * from './rev-regis.service';
export * from './car-regis-item.service';