import { Routes } from '@angular/router';

import { StarterViewComponent } from './views/appviews/starterview.component';
import { LoginComponent } from './views/appviews/login.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import {
  ContractComponent,
  CalculateComponent,
  ContractDetailComponent,
  ContractCanceledComponent
} from './views/appviews/hps';
import { ContractListActiveComponent } from './views/appviews/hps/contract-list/contract-list-active.component';
import { ContractListCanceledComponent } from './views/appviews/hps/contract-list/contract-list-canceled.component';
import { RptSummaryCloseContractComponent } from './views/appviews/hps/rpt-summary-close-contract/rpt-summary-close-contract.component';
import { BookingComponent } from './views/dashboards/booking/booking.component';
import { PaymentComponent } from './views/appviews/hps/payment/payment.component';
import { ContractListCloseContractComponent } from './views/appviews/hps/contract-list/contract-list-close-contract.component';
import { ContractListOtherContractComponent } from './views/appviews/hps/contract-list/contract-list-other-contract.component';
import { GuardGuard } from 'app/guards/guard.guard';
import { ReportBookingComponent } from './views/appviews/report-booking/report-booking.component';
import { ReportCreditNoteComponent } from './views/appviews/report-credit-note/report-credit-note.component';
import { ReportSaleComponent } from './views/appviews/report-sale/report-sale.component';
import { TagSedFormComponent } from './views/appviews/ris/tag-sed-form/tag-sed-form.component';
import { TagClFormComponent } from './views/appviews/ris/tag-cl-form/tag-cl-form.component';
import { TagAlFormComponent } from './views/appviews/ris/tag-al-form/tag-al-form.component';
import { TagAlListComponent } from './views/appviews/ris/tag-al-list/tag-al-list.component';
import { TagClListComponent } from './views/appviews/ris/tag-cl-list/tag-cl-list.component';
import { TagSedListComponent } from './views/appviews/ris/tag-sed-list/tag-sed-list.component';
import { TagSedFormDetailComponent } from './views/appviews/ris/tag-sed-form/tag-sed-form-detail.component';
import { TagAlFormDetailComponent } from './views/appviews/ris/tag-al-form/tag-al-form-detail.component';
import { TagClFormDetailComponent } from './views/appviews/ris/tag-cl-form/tag-cl-form-detail.component';
import { TagConListComponent } from './views/appviews/ris/tag-con-list/tag-con-list.component';
import { TagConFormComponent } from './views/appviews/ris/tag-con-form/tag-con-form.component';
import { TagConFormDetailComponent } from './views/appviews/ris/tag-con-form/tag-con-form-detail.component';
import { TagBookWaitingListComponent } from './views/appviews/ris/tag-book-waiting-list/tag-book-waiting-list.component';
import { TagConFormEditComponent } from './views/appviews/ris/tag-con-form/tag-con-form-edit.component';
import { TagClearMoneyListComponent } from './views/appviews/ris/tag-clear-money-list/tag-clear-money-list.component';
import { ClearMoneyCreateComponent } from './views/appviews/ris/tag-clear-money/clear-money-create.component';
import { ClearMoneyDetailComponent } from './views/appviews/ris/tag-clear-money/clear-money-detail.component';
import { RegisTagComponent } from './views/appviews/report-ris/regis-tag/regis-tag.component';
import { RegisVehicleTaxComponent } from './views/appviews/report-ris/regis-vehicle-tax/regis-vehicle-tax.component';
import { ReceiveDepositListComponent } from './views/appviews/ris/receive-deposit-list/receive-deposit-list.component';
import { ReceiveDepositCreateComponent, ReceiveDepositDetailComponent } from './views/appviews/ris/receive-deposit-form';

import { SummarySaleReportByTypeComponent } from './views/appviews/summary-sale-report-by-type/summary-sale-report-by-type.component';
import { SummaryStockBalanceComponent } from './views/appviews/summary-stock-balance/summary-stock-balance.component';
import { ContractGradePaymentComponent } from './views/appviews/contract-grade-payment/contract-grade-payment.component';
import { SummaryDepositByDateComponent } from './views/appviews/summary-deposit-by-date/summary-deposit-by-date.component';
import { ProductSellingProfitReportComponent } from './views/appviews/product-selling-profit-report/product-selling-profit-report.component';
import { SummaryDepositReportComponent } from './views/appviews/summary-deposit-report/summary-deposit-report.component';
import { ServiceCheckReportComponent } from './views/appviews/service-check-report/service-check-report.component';
import { CreditNoteDetailsReportComponent } from './views/appviews/credit-note-details-report/credit-note-details-report.component';
import { StockBalanceMainReportComponent} from './views/appviews/stock-balance-main-report/stock-balance-main-report.component';
import { ReportRefundBookingComponent} from './views/appviews/report-refund-booking/report-refund-booking.component';
import { ReportTopProductComponent} from './views/appviews/report-top-product/report-top-product.component';
import { ReportTopProductSpareComponent} from './views/appviews/report-top-product-spare/report-top-product-spare.component';
import { CommissionSaleComponent} from './views/appviews/commission-sale/commission-sale.component';
import { CommissionEventComponent} from './views/appviews/commission-event/commission-event.component';
import { TaxPurchaseComponent} from './views/appviews/tax-purchase/tax-purchase.component';
import { TaxSaleComponent} from './views/appviews/tax-sale/tax-sale.component';
import { TaxSaleSpareComponent} from './views/appviews/tax-sale-spare/tax-sale-spare.component';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'starterview', pathMatch: 'full' },

  // Dashboard
  {
    path: 'dashboards', component: BasicLayoutComponent,
    children: [
      { path: 'booking', component: BookingComponent }
    ]
  },

  // App views
  {
    path: '', component: BasicLayoutComponent,
    children: [
      { path: 'starterview', component: StarterViewComponent },
      // { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: 'credit', component: BasicLayoutComponent,
    children: [
      { path: 'contract', component: ContractComponent },
      { path: 'contract-canceled', component: ContractCanceledComponent },
      {
        path: 'contract-list',
        children: [
          { path: 'active', component: ContractListActiveComponent },
          { path: 'canceled', component: ContractListCanceledComponent },
          { path: 'close-contract', component: ContractListCloseContractComponent },
          { path: 'other-contract', component: ContractListOtherContractComponent }
        ]
      },
      { path: 'detail', component: ContractDetailComponent },
      { path: 'calculate', component: CalculateComponent },
      { path: 'rpt-sum-close-contract', component: RptSummaryCloseContractComponent },
      { path: 'payment/:id', component: PaymentComponent }
    ], canActivate: [GuardGuard]
  },
  {
    path: 'report', component: BasicLayoutComponent,
    children: [
      { path: 'booking', component: ReportBookingComponent },
      { path: 'refund-report', component: ReportRefundBookingComponent},
      { path: 'credit-note', component: ReportCreditNoteComponent },
      { path: 'sale-report', component: ReportSaleComponent },
      { path: 'summary-report-by-type', component:SummarySaleReportByTypeComponent},
      { path: 'summary-stock-balance', component:SummaryStockBalanceComponent},
      { path: 'contract-grade-payment', component:ContractGradePaymentComponent},
      { path: 'summary-deposit-by-date', component:SummaryDepositByDateComponent},
      { path: 'product-selling-profit-report', component:ProductSellingProfitReportComponent},
      { path: 'summary-deposit-report', component:SummaryDepositReportComponent},
      { path: 'service-check-report', component:ServiceCheckReportComponent},
      { path: 'report-top-product', component:ReportTopProductComponent},
      { path: 'report-top-spare', component:ReportTopProductSpareComponent},
      
      { path: 'credit-note-details-report', component:CreditNoteDetailsReportComponent},
      { path: 'stock-balance-main-report', component:StockBalanceMainReportComponent},
      { path: 'commission-sale', component:CommissionSaleComponent},
      { path: 'commission-event', component:CommissionEventComponent},
      { path: 'tax-purchase', component:TaxPurchaseComponent},
      { path: 'tax-sale', component:TaxSaleComponent},
      { path: 'tax-sale-spare', component:TaxSaleSpareComponent},
      
    ], canActivate: [GuardGuard]
  },
  {
    path: 'ris', component: BasicLayoutComponent,
    children: [
      { path: 'waiting-tag-list', component: TagBookWaitingListComponent },
      { path: 'con-list', component: TagConListComponent },
      { path: 'con-form-create', component: TagConFormComponent },
      { path: 'con-form-create/:code', component: TagConFormComponent },
      { path: 'con-form-edit/:code', component: TagConFormEditComponent },
      { path: 'con-form-detail/:code', component: TagConFormDetailComponent },
      { path: 'sed-list', component: TagSedListComponent },
      { path: 'sed-form-create', component: TagSedFormComponent },
      { path: 'sed-form-detail/:code', component: TagSedFormDetailComponent },
      { path: 'al-list', component: TagAlListComponent },
      { path: 'al-form-create', component: TagAlFormComponent },
      { path: 'al-form-detail/:code', component: TagAlFormDetailComponent },
      { path: 'cl-list', component: TagClListComponent },
      { path: 'cl-form-create', component: TagClFormComponent },
      { path: 'cl-form-detail/:code', component: TagClFormDetailComponent },
      { path: 'clear-money-list', component: TagClearMoneyListComponent },
      { path: 'clear-money/:mode', component: ClearMoneyCreateComponent },
      { path: 'clear-money/:mode/:code', component: ClearMoneyCreateComponent },
      { path: 'clear-money-detail/:code', component: ClearMoneyDetailComponent },
      { path: 'receive-deposit-list', component: ReceiveDepositListComponent },
      { path: 'receive-deposit-create', component: ReceiveDepositCreateComponent },
      { path: 'receive-deposit-detail/:id', component: ReceiveDepositDetailComponent },
      { path: 'rpt-regis-tag', component: RegisTagComponent },
      { path: 'rpt-regis-vehicle-tax', component: RegisVehicleTaxComponent },


    ], canActivate: [GuardGuard]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
