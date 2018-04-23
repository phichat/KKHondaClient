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
<<<<<<< HEAD
import { SelectizeFinancialDirective } from "../../directives/selectize-financial.directive";
import { SelectizeProductAccessoryDirective } from "../../directives/selectize-product-accessory.directive";
import { SelectizeProductBrandDirective } from "../../directives/selectize-product-brand.directive";
import { SelectizeProductColorDirective } from "../../directives/selectize-product-color.directive";
import { SelectizeProductModelDirective } from "../../directives/selectize-product-model.directive";
import { SelectizeProductPremiumDirective } from "../../directives/selectize-product-premium.directive";
import { SelectizeProductTypeDirective } from "../../directives/selectize-product-type.directive";


import { ModalCustomerComponent } from "../../components/common/modal-customer/modal-customer.component";
import { SelectizeSearchCustomerDirective } from "../../directives/selectize-search-customer.directive";
=======
import { ModalCustomerComponent } from "../../components/common/modal-customer/modal-customer.component";
>>>>>>> cc9d90cf1580cca6974953dff5cd40635b2f08dd

@NgModule({
  declarations: [
    // Directives
    IcheckDirective,
    FootableDirective,
    SelectizeFinancialDirective,
    SelectizeProductAccessoryDirective,
    SelectizeProductBrandDirective,
    SelectizeProductColorDirective,
    SelectizeProductModelDirective,
    SelectizeProductPremiumDirective,
    SelectizeProductTypeDirective,
    SelectizeSearchCustomerDirective,

    // Components
    StarterViewComponent,
    LoginComponent,
    HomeComponent,
    StarterComponent,
    SalesComponent,
    BookingComponent,
<<<<<<< HEAD
    ModalCustomerComponent
=======
    ModalCustomerComponent,
>>>>>>> cc9d90cf1580cca6974953dff5cd40635b2f08dd

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
