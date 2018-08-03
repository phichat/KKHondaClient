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
import { ContractListActiveComponent } from './contract-list/contract-list-active.component';
import { IboxtoolsModule } from '../../../components/common/iboxtools/iboxtools.module';
import { ContractItemComponent } from './contract-item/contract-item.component';
import { ExDetailCustomerComponent } from './ex-detail-customer/ex-detail-customer.component';
import { ExDetailMotobikeComponent } from './ex-detail-motobike/ex-detail-motobike.component';
import { ExDetailAccessoryComponent } from './ex-detail-accessory/ex-detail-accessory.component';
import { CalculateService, ContractItemService, ContractService } from '../../../services/credit';
import { ContractListCanceledComponent } from './contract-list/contract-list-canceled.component';
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

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    IboxtoolsModule,
    RptCutOffSaleModule,
    RptDelayedInterestModule,
    RptDiscountTermModule,
    RptOutstandingModule,
    RptPaymentHistoryModule,
    PageloaderModule
  ],
  declarations: [
    CreditComponent,
    CalculateComponent,
    ContractComponent,
    CalculateListComponent,
    ContractListActiveComponent,
    ContractItemComponent,
    ExDetailCustomerComponent,
    ExDetailMotobikeComponent,
    ExDetailAccessoryComponent,
    ContractListCanceledComponent,
    ContractDetailComponent,
    ContractCanceledComponent,
    ExDetailFreeComponent
  ],
  providers: [
    SellActivityService,
    BookingService,
    // CreditService,
    UserService,
    CalculateService,
    ContractItemService,
    ContractService,
    PageloaderService
  ]
})
export class CreditModule { }
