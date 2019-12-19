import { ContractComponent } from './contract/contract.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { CalculateComponent } from './calculate/calculate.component';
import { ContractCanceledComponent } from './contract-canceled/contract-canceled.component';
import { ContractListActiveComponent } from './contract-list/contract-list-active.component';
import { ContractListCanceledComponent } from './contract-list/contract-list-canceled.component';
import { RptSummaryCloseContractComponent } from './rpt-summary-close-contract/rpt-summary-close-contract.component';
import { PaymentComponent } from './payment/payment.component';
import { ContractListCloseContractComponent } from './contract-list/contract-list-close-contract.component';
import { ContractListOtherContractComponent } from './contract-list/contract-list-other-contract.component';
import { components as CustomerContract } from './customer-contract';
import { components as Calculate } from './calculate';

export const components: any[] = [
  ContractComponent,
  ContractDetailComponent,
  CalculateComponent,
  ContractCanceledComponent,
  ContractListActiveComponent,
  ContractListCanceledComponent,
  RptSummaryCloseContractComponent,
  PaymentComponent,
  ContractListCloseContractComponent,
  ContractListOtherContractComponent,
  ...CustomerContract,
  ...Calculate
];

export * from './contract/contract.component';
export * from './contract-detail/contract-detail.component';
export * from './calculate/calculate.component';
export * from './contract-canceled/contract-canceled.component';
export * from './contract-list/contract-list-active.component';
export * from './contract-list/contract-list-canceled.component';
export * from './rpt-summary-close-contract/rpt-summary-close-contract.component';
export * from './payment/payment.component';
export * from './contract-list/contract-list-close-contract.component';
export * from './contract-list/contract-list-other-contract.component';
export * from './customer-contract';
export * from  './calculate';

