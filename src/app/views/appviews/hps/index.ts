import { ContractComponent } from './contract/contract.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
// import { CalculateComponent } from './calculate/calculate';
import { ContractCanceledComponent } from './contract-canceled/contract-canceled.component';
import { RptSummaryCloseContractComponent } from './rpt-summary-close-contract/rpt-summary-close-contract.component';
import { PaymentComponent } from './payment/payment.component';
import { components as CustomerContract } from './customer-contract';
import { components as CustomerContractList } from './customer-contract';
import { components as Calculate } from './calculate';

export const components: any[] = [
  ContractComponent,
  ContractDetailComponent,
  // CalculateComponent,
  ContractCanceledComponent,
  RptSummaryCloseContractComponent,
  PaymentComponent,
  ...CustomerContract,
  ...CustomerContractList,
  ...Calculate
];

export * from './contract/contract.component';
export * from './contract-detail/contract-detail.component';
export * from './calculate/calculate';
export * from './contract-canceled/contract-canceled.component';
export * from './rpt-summary-close-contract/rpt-summary-close-contract.component';
export * from './payment/payment.component';
export * from './customer-contract';
export * from  './calculate';

