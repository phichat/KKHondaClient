import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

// Modules
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';

// Components
import { StarterViewComponent } from "./starterview.component";
import { LoginComponent } from "./login.component";

import { PeityModule } from '../../components/charts/peity';
import { SparklineModule } from '../../components/charts/sparkline';
import { HomeComponent } from './home/home.component';
import { StarterComponent } from './starter/starter.component';
import { SalesComponent } from './sales/sales.component';
import { BookingComponent } from './booking/booking.component';

// Directives
import { IcheckDirective } from "../../directives/icheck.directive";
import { FootableDirective } from "../../directives/footable.directive";
import { ModalCustomerComponent } from "../../components/common/modal-customer/modal-customer.component";

@NgModule({
  declarations: [
    // Components
    StarterViewComponent,
    LoginComponent,
    HomeComponent,
    StarterComponent,
    SalesComponent,
    BookingComponent,
    ModalCustomerComponent,

    // Directives
    IcheckDirective,
    FootableDirective
  ],
  imports: [
    BrowserModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule
  ],
  exports: [
    StarterViewComponent,
    LoginComponent
  ],
})

export class AppviewsModule {
}
