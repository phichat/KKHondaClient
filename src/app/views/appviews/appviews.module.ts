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

// Directives
import { IcheckDirective } from "../../directives/icheck.directive";
import { FootableDirective } from "../../directives/footable.directive";
import { SelectizeFinancialDirective } from "../../directives/selectize-financial.directive";
import { SelectizeProductAccessoryDirective } from "../../directives/selectize-product-accessory.directive";
import { SelectizeProductBrandDirective } from "../../directives/selectize-product-brand.directive";
import { SelectizeProductColorDirective } from "../../directives/selectize-product-color.directive";
import { SelectizeProductModelDirective } from "../../directives/selectize-product-model.directive";
import { SelectizeProductPremiumDirective } from "../../directives/selectize-product-premium.directive";
import { SelectizeProductTypeDirective } from "../../directives/selectize-product-type.directive";

import { SelectizeSearchCustomerDirective } from "../../directives/selectize-search-customer.directive";
import { FormsModule } from "@angular/forms";
import { SelectizeDirective } from "../../directives/selectize.directive";
import { InputmaskDirective } from "../../directives/inputmask.directive";
import { SelectizeProductCategoriesDirective } from "../../directives/selectize-product-categories.directive";
import { SellingModule } from "./selling/selling.module";
// import { ProductService } from "../../services";

@NgModule({
  declarations: [
    // Directives
    // IcheckDirective,
    // FootableDirective,
    // SelectizeDirective,
    // SelectizeFinancialDirective,
    // SelectizeProductAccessoryDirective,
    // SelectizeProductBrandDirective,
    // SelectizeProductColorDirective,
    // SelectizeProductModelDirective,
    // SelectizeProductPremiumDirective,
    // SelectizeProductTypeDirective,
    // SelectizeSearchCustomerDirective,
    // SelectizeProductCategoriesDirective,
    // InputmaskDirective,

    // Components
    StarterViewComponent,
    LoginComponent,
    HomeComponent,
    StarterComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    SellingModule
  ],
  exports: [
    // IcheckDirective
  ],
  providers: [
    // ProductService
  ]
})

export class AppviewsModule {
}
