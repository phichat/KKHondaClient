

import { CreditComponent as CalCreditComponent } from './credit.component';
import { HpsComponent as CalHpsComponent } from './hps.component';
import { LeasingComponent as CalLeasingComponent } from './leasing.component';
import { CashComponent } from 'app/views/components/payment-type/cash.component';

export const components: any[] = [
  CalCreditComponent,
  CalHpsComponent,
  CalLeasingComponent,
  CashComponent
]

export * from './credit.component';
export * from './hps.component';
export * from './leasing.component';
export * from 'app/views/components/payment-type/cash.component';
