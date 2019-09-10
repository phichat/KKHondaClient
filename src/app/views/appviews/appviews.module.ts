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
import { CreditModule } from './credit/credit.module';
import { CustomerService } from '../../services/customers';
import { RISModule } from './ris/ris.module';
import { ReportBookingModule } from './report-booking/report-booking.module';
import { ReportCreditNoteModule } from './report-credit-note/report-credit-note.module';
import { ReportSaleModule } from './report-sale/report-sale.module';
import { ReportBalanceStock1Module } from './report-balance-stock1/report-balance-stock1.module';

@NgModule({
  declarations: [
    StarterViewComponent,
    LoginComponent,
    StarterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    CreditModule,
    RISModule,
    ReportBookingModule,
    ReportCreditNoteModule,
    ReportSaleModule,
    ReportBalanceStock1Module
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
