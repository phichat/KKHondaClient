import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// Modules
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';

// Components
import { StarterViewComponent } from './starterview.component';
import { LoginComponent } from './login.component';

import { PeityModule } from '../../components/charts/peity';
import { SparklineModule } from '../../components/charts/sparkline';
import { StarterComponent } from './starter/starter.component';

import { FormsModule } from '@angular/forms';
import { CreditModule } from './hps/credit.module';
import { CustomerService } from '../../services/customers';
import { ReportBookingModule } from './report-booking/report-booking.module';
import { ReportCreditNoteModule } from './report-credit-note/report-credit-note.module';
import { ReportSaleModule } from './report-sale/report-sale.module';
import { RISModule } from './ris/ris.module';
import { ReportRisModule } from './report-ris/report-ris.module';

import { SummarySaleReportByTypeModule } from './summary-sale-report-by-type/summary-sale-report-by-type.module';
import { SummaryStockBalanceModule } from './summary-stock-balance/summary-stock-balance.module';
import { ContractGradePaymentModule } from './contract-grade-payment/contract-grade-payment.module';
import { SummaryDepositByDateModule } from './summary-deposit-by-date/summary-deposit-by-date.module';
import { ProductSellingProfitReportModule } from './product-selling-profit-report/product-selling-profit-report.module';
import { SummaryDepositReportModule } from './summary-deposit-report/summary-deposit-report.module';
import { ServiceCheckReportModule } from './service-check-report/service-check-report.module';
import { CreditNoteDetailsReportModule } from './credit-note-details-report/credit-note-details-report.module';
import { StockBalanceMainReportModule } from './stock-balance-main-report/stock-balance-main-report.module';
import { ReportRefundBookingModule } from './report-refund-booking/report-refund-booking.module';
import { ReportTopProductModule } from './report-top-product/report-top-product.module';
import { ReportTopProductSpareModule } from './report-top-product-spare/report-top-product-spare.module';
import { CommissionSaleModule } from './commission-sale/commission-sale.module';
import { CommissionEventModule } from './commission-event/commission-event.module';
import { TaxPurchaseModule } from './tax-purchase/tax-purchase.module';
import { TaxSaleModule } from './tax-sale/tax-sale.module';
import { TaxSaleSpareModule } from './tax-sale-spare/tax-sale-spare.module';

import { MCSModule } from './mcs/mcs.module';
import { PSSModule } from './pss/pss.module';
import { SaleModule } from './sale/sale.module';

@NgModule({
  declarations: [
    StarterViewComponent,
    LoginComponent,
    StarterComponent,    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    CreditModule,
    ReportBookingModule,
    ReportCreditNoteModule,
    ReportSaleModule,    
    ReportRisModule,
    RISModule,
    SummarySaleReportByTypeModule,    
    SummaryStockBalanceModule,
    ContractGradePaymentModule,
    SummaryDepositByDateModule,
    ProductSellingProfitReportModule,
    SummaryDepositReportModule,
    ServiceCheckReportModule,
    CreditNoteDetailsReportModule,
    StockBalanceMainReportModule,
    ReportRefundBookingModule,
    ReportTopProductModule,
    ReportTopProductSpareModule,
    CommissionSaleModule,
    CommissionEventModule,
    TaxPurchaseModule,
    TaxSaleModule,
    TaxSaleSpareModule,
    SaleModule,

    MCSModule,
    PSSModule,
    
  ],
  exports: [
    // IcheckDirective
  ],
  providers: [
    CustomerService
  ]
})

export class AppviewsModule {
}
