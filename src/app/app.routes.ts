import { Routes } from '@angular/router';

import { StarterViewComponent } from './views/appviews/starterview.component';
import { BasicLayoutComponent } from './components/common/layouts/basicLayout.component';
import * as Hps from './views/appviews/hps';
import * as Sale from './views/appviews/sale';
import * as Wholesale from './views/appviews/wholesale';
import { BookingComponent } from './views/dashboards/booking/booking.component';
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
import { RegisTagSecondHandComponent } from './views/appviews/report-ris/regis-tag-second-hand/regis-tag-second-hand.component';
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
import { StockBalanceMainReportComponent } from './views/appviews/stock-balance-main-report/stock-balance-main-report.component';
import { ReportRefundBookingComponent } from './views/appviews/report-refund-booking/report-refund-booking.component';
import { ReportTopProductComponent } from './views/appviews/report-top-product/report-top-product.component';
import { ReportTopProductSpareComponent } from './views/appviews/report-top-product-spare/report-top-product-spare.component';
import { CommissionSaleComponent } from './views/appviews/commission-sale/commission-sale.component';
import { CommissionEventComponent } from './views/appviews/commission-event/commission-event.component';
import { TaxPurchaseComponent } from './views/appviews/tax-purchase/tax-purchase.component';
import { TaxSaleComponent } from './views/appviews/tax-sale/tax-sale.component';
import { TaxSaleSpareComponent } from './views/appviews/tax-sale-spare/tax-sale-spare.component';

import { McsSaveInvoiceListComponent } from './views/appviews/mcs/mcs-save-invoice/mcs-save-invoice-list.component';
import { McsSaveInvoiceCreateComponent } from './views/appviews/mcs/mcs-save-invoice/mcs-save-invoice-create.component';
import { McsSaveInvoiceDetailComponent } from './views/appviews/mcs/mcs-save-invoice/mcs-save-invoice-detail.component';

import { McsSaveReceiptListComponent } from './views/appviews/mcs/mcs-save-receipt/mcs-save-receipt-list.component';
import { McsSaveReceiptCreateComponent } from './views/appviews/mcs/mcs-save-receipt/mcs-save-receipt-create.component';
import { McsSaveReceiptDetailComponent } from './views/appviews/mcs/mcs-save-receipt/mcs-save-receipt-detail.component';

import { McsReportReceiveComponent } from './views/appviews/mcs/mcs-report-receive/mcs-report-receive.component';
import { McsReportTaxPoComponent } from './views/appviews/mcs/mcs-report-tax-po/mcs-report-tax-po.component';

import { PssSavePoListComponent } from './views/appviews/pss/pss-save-po/pss-save-po-list.component';
import { PssSavePoCreateComponent } from './views/appviews/pss/pss-save-po/pss-save-po-create.component';
import { PssSavePoDetailComponent } from './views/appviews/pss/pss-save-po/pss-save-po-detail.component';

import { PssStockReceiveListComponent } from './views/appviews/pss/pss-stock-receive/pss-stock-receive-list.component';
import { PssStockReceiveCreateComponent } from './views/appviews/pss/pss-stock-receive/pss-stock-receive-create.component';
import { PssStockReceiveDetailComponent } from './views/appviews/pss/pss-stock-receive/pss-stock-receive-detail.component';

import { PssReturnProductListComponent } from './views/appviews/pss/pss-return-product/pss-return-product-list.component';
import { PssReturnProductCreateComponent } from './views/appviews/pss/pss-return-product/pss-return-product-create.component';
import { PssReturnProductDetailComponent } from './views/appviews/pss/pss-return-product/pss-return-product-detail.component';

import { McsStockReceiveListComponent } from './views/appviews/mcs/mcs-stock-receive/mcs-stock-receive-list.component';
import { McsStockReceiveDetailComponent } from './views/appviews/mcs/mcs-stock-receive/mcs-stock-receive-detail.component';
import { McsStockReceiveCreateComponent } from './views/appviews/mcs/mcs-stock-receive/mcs-stock-receive-create.component';
import { McsStockReceiveSingleCreateComponent } from './views/appviews/mcs/mcs-stock-receive/mcs-stock-receive-single-create.component';
import { McsStockReceiveSingleDetailComponent } from './views/appviews/mcs/mcs-stock-receive/mcs-stock-receive-single-detail.component';

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
    path: 'sale', component: BasicLayoutComponent,
    children: [
      { path: 'sale-list', component: Sale.SaleListComponent },
      { path: 'sale-detail', component: Sale.SaleDetailComponent }
    ]
  },
  {
    path: 'wholesale', component: BasicLayoutComponent,
    children: [
      { path: 'booking-list', component: Wholesale.BookingListComponent },
      { path: 'booking-edit', component: Wholesale.BookingEditComponent },
      { path: 'booking-add-money', component: Wholesale.BookingAddMoneyComponent },
      { path: 'booking-detail', component: Wholesale.BookingDetailComponent },
      { path: 'booking-create', component: Wholesale.BookingCreateComponent },
      { path: 'sale-list', component: Wholesale.SaleListComponent },
      { path: 'sale-create', component: Wholesale.SaleCreateComponent },
      { path: 'sale-detail', component: Wholesale.SaleDetailComponent },
    ],
    canActivate: [GuardGuard]
  },
  {
    path: 'credit', component: BasicLayoutComponent,
    children: [
      { path: 'contract', component: Hps.ContractComponent },
      { path: 'contract-canceled', component: Hps.ContractCanceledComponent },
      { path: 'detail', component: Hps.ContractDetailComponent },
      { path: 'calculate-credit', component: Hps.CreditComponent },
      { path: 'calculate-hps', component: Hps.HpsComponent },
      { path: 'calculate-leasing', component: Hps.LeasingComponent },
      { path: 'calculate-cash', component: Hps.CashComponent },
      { path: 'rpt-sum-close-contract', component: Hps.RptSummaryCloseContractComponent },
      { path: 'payment/:id', component: Hps.PaymentComponent }
    ], canActivate: [GuardGuard]
  },
  {
    path: 'report', component: BasicLayoutComponent,
    children: [
      { path: 'booking', component: ReportBookingComponent },
      { path: 'refund-report', component: ReportRefundBookingComponent },
      { path: 'credit-note', component: ReportCreditNoteComponent },
      { path: 'sale-report', component: ReportSaleComponent },
      { path: 'summary-report-by-type', component: SummarySaleReportByTypeComponent },
      { path: 'summary-stock-balance', component: SummaryStockBalanceComponent },
      { path: 'contract-grade-payment', component: ContractGradePaymentComponent },
      { path: 'summary-deposit-by-date', component: SummaryDepositByDateComponent },
      { path: 'product-selling-profit-report', component: ProductSellingProfitReportComponent },
      { path: 'summary-deposit-report', component: SummaryDepositReportComponent },
      { path: 'service-check-report', component: ServiceCheckReportComponent },
      { path: 'report-top-product', component: ReportTopProductComponent },
      { path: 'report-top-spare', component: ReportTopProductSpareComponent },

      { path: 'credit-note-details-report', component: CreditNoteDetailsReportComponent },
      { path: 'stock-balance-main-report', component: StockBalanceMainReportComponent },
      { path: 'commission-sale', component: CommissionSaleComponent },
      { path: 'commission-event', component: CommissionEventComponent },
      { path: 'tax-purchase', component: TaxPurchaseComponent },
      { path: 'tax-sale', component: TaxSaleComponent },
      { path: 'tax-sale-spare', component: TaxSaleSpareComponent },

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
      { path: 'rpt-regis-tag-second-hand', component: RegisTagSecondHandComponent },


    ], canActivate: [GuardGuard]
  },
  {
    path: 'mcs', component: BasicLayoutComponent,
    children: [
      // { path: 'mcs-save-po-list', component: McsSavePoListComponent },
      // { path: 'mcs-save-po-create', component: McsSavePoCreateComponent },
      // { path: 'mcs-save-po-detail/:code', component: McsSavePoDetailComponent },
      // { path: 'mcs-save-po-edit/:code', component: McsSavePoEditComponent },

      { path: 'mcs-stock-receive-list', component: McsStockReceiveListComponent },
      { path: 'mcs-stock-receive-create', component: McsStockReceiveCreateComponent },
      { path: 'mcs-stock-receive-detail/:code', component: McsStockReceiveDetailComponent },
      { path: 'mcs-stock-receive-single-create', component: McsStockReceiveSingleCreateComponent },
      { path: 'mcs-stock-receive-single-detail/:code', component: McsStockReceiveSingleDetailComponent },

      // { path: 'mcs-save-invoice-list', component: McsSaveInvoiceListComponent },
      // { path: 'mcs-save-invoice-create', component: McsSaveInvoiceCreateComponent },
      // { path: 'mcs-save-invoice-detail/:code', component: McsSaveInvoiceDetailComponent },

      // { path: 'mcs-save-receipt', component: McsSaveReceiptListComponent },
      // { path: 'mcs-save-receipt-create', component: McsSaveReceiptCreateComponent },
      // { path: 'mcs-save-receipt-detail/:code', component: McsSaveReceiptDetailComponent },

      // { path: 'mcs-report-receive', component: McsReportReceiveComponent },
      // { path: 'mcs-report-tax-po', component: McsReportTaxPoComponent },
    ], canActivate: [GuardGuard]
  },
  {
    path: 'pss', component: BasicLayoutComponent,
    children: [

      { path: 'pss-save-po-list', component: PssSavePoListComponent },
      { path: 'pss-save-po-create', component: PssSavePoCreateComponent },
      { path: 'pss-save-po-detail/:code', component: PssSavePoDetailComponent },

      { path: 'pss-stock-receive-list', component: PssStockReceiveListComponent },
      { path: 'pss-stock-receive-create', component: PssStockReceiveCreateComponent },
      { path: 'pss-stock-receive-detail/:code', component: PssStockReceiveDetailComponent },

      { path: 'pss-return-product-list', component: PssReturnProductListComponent },
      { path: 'pss-return-product-create', component: PssReturnProductCreateComponent },
      { path: 'pss-return-product-detail/:code', component: PssReturnProductDetailComponent },
      // { path: 'pss-return-product-edit/:code', component: PssReturnProductEditComponent },

    ], canActivate: [GuardGuard]
  },

  // Handle all other routes
  { path: '**', redirectTo: 'starterview' }
];
