import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditComponent } from './credit.component';
import { BookingService } from '../../../services/selling';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculateComponent } from './calculate/calculate.component';
import { ContractComponent } from './contract/contract.component';
import { UserService } from '../../../services/users';
import { SellActivityService } from '../../../services/sell-activity';
import { CalculateListComponent } from './calculate-list/calculate-list.component';
import { IboxtoolsModule } from '../../../components/common/iboxtools/iboxtools.module';
import { ContractItemComponent } from './contract-item/contract-item.component';
import { ExDetailCustomerComponent } from './ex-detail-customer/ex-detail-customer.component';
import { ExDetailMotobikeComponent } from './ex-detail-motobike/ex-detail-motobike.component';
import { ExDetailAccessoryComponent } from './ex-detail-accessory/ex-detail-accessory.component';
import { SaleService, ContractItemService, ContractService, RptSummayCloseContractService } from '../../../services/credit';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ContractCanceledComponent } from './contract-canceled/contract-canceled.component';
import { ExDetailFreeComponent } from './ex-detail-free/ex-detail-free.component';
import { RptCutOffSaleModule } from './rpt-cut-off-sale/rpt-cut-off-sale.module';
import { RptDelayedInterestModule } from './rpt-delayed-interest/rpt-delayed-interest.module';
import { RptDiscountTermModule } from './rpt-discount-term/rpt-discount-term.module';
import { RptOutstandingModule } from './rpt-outstanding/rpt-outstanding.module';
import { RptPaymentHistoryModule } from './rpt-payment-history/rpt-payment-history.module';
import { PageloaderModule } from '../pageloader/pageloader.module';
import { PageloaderService } from '../pageloader/pageloader.component';
import { RptSummaryCloseContractComponent } from './rpt-summary-close-contract/rpt-summary-close-contract.component';
import { ThaiMatDatepickerModule } from 'app/components/common/thai-mat-datepicker/thai-mat-datepicker.module';
import { PaymentComponent } from './payment/payment.component';
import { PaymentTypeModule } from 'app/views/components/payment-type/payment-type.module';
import { PaymentService } from 'app/services/credit/payment.service';
import { CustomerContractComponent } from './customer-contract/customer-contract.component';
import { CustomerContractListComponent } from './customer-contract/customer-contract-list.component';
import { ContractCustomerService } from 'app/services/credit/contract-customer.service';
import { components as CustomerContract } from './customer-contract';
import { components as Calculate } from './calculate';
import { components as Payment } from './payment';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThaiMatDatepickerModule,
    IboxtoolsModule,
    RptCutOffSaleModule,
    RptDelayedInterestModule,
    RptDiscountTermModule,
    RptOutstandingModule,
    RptPaymentHistoryModule,
    PageloaderModule,
    PaymentTypeModule,
  ],
  exports: [
    ExDetailCustomerComponent,
    ExDetailMotobikeComponent,
    ExDetailAccessoryComponent,
    ExDetailFreeComponent,
  ],
  declarations: [
    CreditComponent,
    CalculateComponent,
    ContractComponent,
    CalculateListComponent,
    ContractItemComponent,
    ExDetailCustomerComponent,
    ExDetailMotobikeComponent,
    ExDetailAccessoryComponent,
    ContractDetailComponent,
    ContractCanceledComponent,
    ExDetailFreeComponent,
    RptSummaryCloseContractComponent,
    PaymentComponent,
    CustomerContractComponent,
    CustomerContractListComponent,
    ...CustomerContract,
    ...Calculate,
    ...Payment
  ],
  providers: [
    SellActivityService,
    BookingService,
    PaymentService,
    UserService,
    SaleService,
    ContractService,
    ContractItemService,
    ContractCustomerService,
    PageloaderService,
    RptSummayCloseContractService
  ]
})
export class CreditModule { }
