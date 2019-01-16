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
import { ReportBookingModule } from './report-booking/report-booking.module';

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
    ReportBookingModule
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
